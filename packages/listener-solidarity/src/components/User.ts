import { Widget, User, MetaField, Entries, Instance } from "../types";
import dbg from "../dbg";
import { getOrganizationType, setType } from "../utils";
import { getGeocoding } from "../utils";
import { insertSolidarityUsers, updateFormEntries } from "../graphql/mutations";
import { createZendeskUser } from "../zendesk";
import Bottleneck from "bottleneck";

const log = dbg.extend("User");

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

const handleError = (entries: User[]) => {
  log(
    `Integration failed in these form entries ${entries.map(
      (e) => e.external_id
    )}`
  );
  return undefined;
};

const organizationsIds = {
  MSR: 360273031591,
  THERAPIST: 360282119532,
  LAWYER: 360269610652,
};

let cache = new Array();

const createUsersHasura = async (
  results: Array<{ id: number; status: string; external_id: string }>,
  users: User[]
) => {
  if (results.length < 1 || users.length < 1) {
    return handleError(users);
  }

  const hasuraUsers = results.map((r) => {
    const user = users.find((u) => u.external_id === r.external_id);
    return {
      ...user,
      ...((user && user.user_fields) || {}),
      community_id: Number(process.env.COMMUNITY_ID),
      user_id: r.id,
    };
  });

  log("Saving users in Hasura...");
  let syncronizedForms = new Array();
  const inserted = await insertSolidarityUsers(hasuraUsers);
  if (!inserted) return handleError(users);

  // Batch update syncronized forms
  syncronizedForms = [
    ...syncronizedForms,
    ...inserted.map((i) => i.external_id),
  ];
  log("Updating form_entries syncronized on GraphQL API...");
  log({ syncronizedForms });
  const updateEntries = await updateFormEntries(syncronizedForms);
  if (!updateEntries) {
    log("Couldn't update form entries with already syncronized forms");
    return handleError(users);
  }

  cache = [];
  return log("Integration is done.");
};

const makeBatchRequests = async (users) => {
  let start = 0;
  let step = 50;
  let usersLength = users.length;
  for (start; start < usersLength; start += step) {
    log({ start, step, usersLength });
    const batch = users.slice(start, start + step - 1);
    // Create users in Zendesk
    // Cb create users in Hasura
    return await limiter.schedule(() =>
      createZendeskUser(batch, createUsersHasura)
    );
  }
};

const handleNext = (widgets: Widget[]) => async (response: any) => {
  log(`${new Date()}: \nReceiving data on subscription GraphQL API...`);

  const {
    data: { form_entries: entries },
  } = response;

  cache = entries.map((entry: any) => {
    if (!cache.includes(entry.id)) return entry;
    return;
  });

  if (cache.length > 0) {
    const usersToRegister = cache.map((formEntry: Entries) => {
      const fields = JSON.parse(formEntry.fields);
      const widget = widgets.filter(
        (w: Widget) => w.id === formEntry.widget_id
      )[0];

      if (!widget) return;

      const instance: Instance = {
        tipo_de_acolhimento: null,
        first_name: "",
        email: "",
      };

      const formMapping = widget.metadata.form_mapping.map(
        (field: MetaField) => {
          const acessors = field.name.split(".");
          if (acessors.length === 1) {
            instance[acessors[0]] = (
              fields.filter((f: any) => f.uid === field.uid)[0] || {}
            ).value;
          } else {
            // extra fields
            const rootField = acessors[0];
            const childField = acessors[1];
            const value = {
              [childField]: (
                fields.filter((f: any) => f.uid === field.uid)[0] || {}
              ).value,
            };

            instance[rootField] = { ...instance[rootField], ...value };
          }
        }
      );

      return Promise.all(formMapping).then(async () => {
        const register: User = {
          name: "",
          role: "end-user",
          organization_id: 0,
          email: "",
          external_id: "",
          phone: "",
          user_fields: {
            tipo_de_acolhimento: null,
            condition: "desabilitada",
            state: "",
            city: "",
            cep: "",
            address: "",
            whatsapp: null,
            registration_number: null,
            occupation_area: null,
            disponibilidade_de_atendimentos: null,
            data_de_inscricao_no_bonde: null,
          },
        };

        register["email"] = instance.email;
        if (instance.phone) register["phone"] = instance.phone;
        register["name"] = instance.last_name
          ? `${instance.first_name} ${instance.last_name}`
          : instance.first_name;
        register["organization_id"] =
          organizationsIds[getOrganizationType(widget.id)];
        register["external_id"] = formEntry.id.toString();
        register["verified"] = true;
        register["user_fields"]["data_de_inscricao_no_bonde"] =
          formEntry.created_at;

        const geocoding = await getGeocoding(instance);
        Object.keys(geocoding).map((g) => {
          register["user_fields"][g] = geocoding[g];
        });

        const terms =
          (instance["extras"] && instance["extras"]["accept_terms"]) || "";
        if (terms.match(/sim/gi))
          register["user_fields"]["condition"] = "inscrita";
        if (
          formEntry.created_at < "2019-06-10 18:08:55.49997" &&
          widget.id === 16850
        )
          register["user_fields"]["condition"] = "inscrita";

        // fields that may go into the `user_fields`
        register["user_fields"]["tipo_de_acolhimento"] = setType(
          instance.tipo_de_acolhimento
        );
        if (instance.whatsapp)
          register["user_fields"]["whatsapp"] = instance.whatsapp;
        if (instance.registration_number)
          register["user_fields"]["registration_number"] =
            instance.registration_number;
        if (instance.occupation_area)
          register["user_fields"]["occupation_area"] = instance.occupation_area;
        if (instance.disponibilidade_de_atendimentos) {
          register["user_fields"]["disponibilidade_de_atendimentos"] =
            instance.disponibilidade_de_atendimentos;
        }

        // store instances
        return register;
      });
    });

    return Promise.all(usersToRegister).then(async (users: any) => {
      // Batch insert individuals
      log("Creating users in Zendesk...");
      // Create users in Zendesk
      // Cb create users in Hasura
      return await makeBatchRequests(users);
    });
  } else {
    log("No items for integration.");
  }
};

export default handleNext;
