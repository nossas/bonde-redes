import { Widget, User, MetaField, Entries, Instance } from "../types";
import dbg from "../dbg";
import { getOrganizationType, setType } from "../utils";
// import getGeocoding from "../utils";
// import {
//   insertSolidarityUsers,
//   updateFormEntries
// } from "../graphql/mutations";
import { createZendeskUser } from "../zendesk";

const log = dbg.extend("User");

const handleError = (entries: User[]) => {
  log(
    `Integration failed in these form entries ${entries.map(
      (e) => e.external_id
    )}`
  );
  return undefined;
};

const createUsersHasura = (
  results: Array<{ id: number; status: string; external_id: string }>,
  users: User[]
) => {
  if (results.length < 1 || users.length < 1) {
    return handleError(users);
  }
  const hasuraUsers: Array<User & { user_id: number }> = results.map((r) => {
    const user = users.find((u) => u.external_id === r.external_id);
    return {
      ...user,
      user_id: r.id,
    };
  });
  log("Saving users in Hasura...");
  log(hasuraUsers);
  return Promise.resolve(true);
  // return insertSolidarityUsers(hasuraUsers);

  // // Batch update syncronized forms
  // console.log("Updating form_entries syncronized on GraphQL API...");
  // console.log({ syncronizedForms });
  // await updateFormEntries(syncronizedForms);
  // cache = [];
  // console.log("Integration is done.");
};

const organizationsIds = {
  MSR: 360273031591,
  THERAPIST: 360282119532,
  LAWYER: 360269610652,
};

let cache = new Array();
let syncronizedForms = new Array();
let individuals = new Array();

const register: User = {
  name: "",
  role: "end-user",
  organization_id: 0,
  email: "",
  external_id: "",
  phone: null,
  user_fields: {
    tipo_de_acolhimento: null,
    condition: "desabilitada",
    state: "",
    city: "",
    neighborhood: "",
    cep: "",
    address: "",
    whatsapp: null,
    registration_number: null,
    occupation_area: null,
    disponibilidade_de_atendimentos: null,
  },
};

const handleNext = (widgets: Widget[]) => async (response: any) => {
  log(`${new Date()}: \nReceiving data on subscription GraphQL API...`);
  log({ response: response.data.form_entries });

  const {
    data: { form_entries: entries },
  } = response;

  cache = entries.map((entry: any) => {
    if (!cache.includes(entry.id)) return entry;
    return;
  });

  if (cache.length > 0) {
    const registers = cache.map(async (formEntry: Entries) => {
      const fields = JSON.parse(formEntry.fields);
      const widget = widgets.filter(
        (w: Widget) => w.id === formEntry.widget_id
      )[0];
      if (widget) {
        const instance: Instance = {
          tipo_de_acolhimento: null,
          first_name: "",
          email: "",
        };

        widget.metadata.form_mapping.map((field: MetaField) => {
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
        });

        register["email"] = instance.email;
        if (instance.phone) register["phone"] = instance.phone;
        register["name"] = instance.last_name
          ? `${instance.first_name} ${instance.last_name}`
          : instance.first_name;
        register["organization_id"] =
          organizationsIds[getOrganizationType(widget.id)];
        register["external_id"] = formEntry.id.toString();
        register["verified"] = true;

        // const geocoding = await getGeocoding(instance);
        // Object.keys(geocoding).map((g) => {
        //   register["user_fields"][g] = geocoding[g];
        // });

        if (instance["extras"] && instance["extras"]["accept_terms"] === "sim")
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
        // widget 1733 and 16838 have two fields that indicate "disponibilidade"
        if (instance["extras"]["disponibilidade_de_atendimentos_um"]) {
          register["user_fields"]["disponibilidade_de_atendimentos"] =
            instance["extras"]["disponibilidade_de_atendimentos_um"] +
            instance["extras"]["disponibilidade_de_atendimentos_dois"];
        } else if (instance.disponibilidade_de_atendimentos) {
          register["user_fields"]["disponibilidade_de_atendimentos"] =
            instance.disponibilidade_de_atendimentos;
        }

        log({ register });

        // store instances
        individuals = [...individuals, register];
        syncronizedForms = [...syncronizedForms, formEntry.id];
      }
      return false;
    });

    Promise.all(registers).then(async () => {
      // Batch insert individuals
      log("Creating users in Zendesk...");

      // Create users in Zendesk
      // Cb create users in Hasura
      await createZendeskUser(individuals, createUsersHasura);
    });
  } else {
    log("No items for integration.");
  }
};

export default handleNext;
