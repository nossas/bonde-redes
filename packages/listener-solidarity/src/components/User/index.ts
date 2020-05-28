import { Widget, User, MetaField, Entries, Instance } from "../../types";
import dbg from "../../dbg";
import { getOrganizationType, setType, organizationsIds } from "../../utils";
import { getGeocoding } from "../../utils";
import makeBatchRequests from "./batchRequests";

const log = dbg.extend("User");

let cache = new Array();

const handleNext = (widgets: Widget[]) => async (response: any) => {
  log(`${new Date()}: \nReceiving data on subscription GraphQL API...`);
  // log({ response: response.data.form_entries });

  const {
    data: { form_entries: entries },
  } = response;

  cache = entries.map((entry: any) => {
    if (!cache.includes(entry.id)) return entry;
    return;
  });

  if (cache.length > 0) {
    const usersToRegister = cache.map(async (formEntry: Entries) => {
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

      // log({ instance });

      const register: User = {
        name: "",
        role: "end-user",
        organization_id: 0,
        email: "",
        external_id: "",
        phone: "",
        verified: true,
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
          data_de_inscricao_no_bonde: "",
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

      for (let key in register.user_fields) {
        if (instance[key]) register["user_fields"][key] = instance[key];
      }

      register["user_fields"]["data_de_inscricao_no_bonde"] =
        formEntry.created_at;

      // register["user_fields"]["state"] = "";
      const geocoding = await getGeocoding(instance);
      Object.keys(geocoding).map((g) => {
        register["user_fields"][g] = geocoding[g];
      });

      const terms =
        (instance["extras"] && instance["extras"]["accept_terms"]) || "";
      if (terms.match(/sim/gi))
        register["user_fields"]["condition"] = "inscrita";
      // Some MSR forms didn't have the `accept_terms` field
      if (
        formEntry.created_at < "2019-06-10 18:08:55.49997" &&
        widget.id === 16850
      )
        register["user_fields"]["condition"] = "inscrita";

      register["user_fields"]["tipo_de_acolhimento"] = setType(
        instance.tipo_de_acolhimento
      );

      // log({ register });

      return register;
    });

    return Promise.all(usersToRegister).then(async (users: any) => {
      // Batch insert individuals
      log("Creating users in Zendesk...");
      // Create users in Zendesk
      // Cb create users in Hasura
      await makeBatchRequests(users);
      return (cache = []);
    });
  } else {
    log("No items for integration.");
  }
};

export default handleNext;
