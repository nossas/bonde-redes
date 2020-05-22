// import {
//   updateFormEntries,
//   insertRedeIndividuals
// } from "../../graphql/mutations";
import { Widget } from "../types";
import dbg from "../dbg";
import { getGeocoding } from "../utils";
import { insertSolidarityUsers, updateFormEntries } from "../graphql/mutations";

const log = dbg.extend("User");

interface MetaField {
  uid: string;
  name: string;
}

type Entries = {
  fields: string;
  widget_id: number;
  id: number;
};

type Instance = {
  extras?: {
    accept_terms?: "sim" | "não";
  };
  tipo_de_acolhimento?: "jurídico" | "psicológico" | "psicológico_e_jurídico";
  first_name?: string;
  last_name?: string;
  condition: "inscrita" | "desabilitada";
  state?: string;
  city?: string;
  neighborhood?: string;
  cep?: string;
  address?: string;
};

type User = {
  name: string;
  role: "end-user";
  organization_id: number;
  user_fields: {
    tipo_de_acolhimento:
      | "jurídico"
      | "psicológico"
      | "psicológico_e_jurídico"
      | null;
    condition: "inscrita" | "desabilitada" | null;
    state: string;
    city: string;
    neighborhood: string;
    cep: string;
    address: string;
  };
};

const setType = (type: string) => {
  switch (type) {
    case "Acolhimento Jurídico":
      return "jurídico";
    case "Acolhimento Terapêutico":
      return "psicológico";
    case "Acolhimento Terapêutico & Jurídico":
    case "psicológico & Jurídico":
    case "Psicológico & Jurídico":
      return "psicológico_e_jurídico";
    default:
      return null;
  }
};

const therapist_widgets = [2760, 16835, 17628];
const lawyer_widgets = [8190, 16838, 17633];

const getOrganizationType = (id: number): string => {
  if (therapist_widgets.includes(id)) return "THERAPIST";
  if (lawyer_widgets.includes(id)) return "LAWYER";
  return "MSR";
};

const organizationsIds = {
  MSR: 360273031591,
  THERAPIST: 360282119532,
  LAWYER: 360269610652,
};

const handleNext = (widgets: Widget[]) => async (response: any) => {
  log(`${new Date()}: \nReceiving data on subscription GraphQL API...`);
  log({ response: response.data.form_entries });

  const {
    data: { form_entries: entries },
  } = response;

  let cache = new Array();

  cache = entries.map((entry: any) => {
    if (!cache.includes(entry.id)) return entry;
    return;
  });

  let syncronizedForms = new Array();
  let individuals = new Array();

  if (cache.length > 0) {
    const registers = cache.map(async (formEntry: Entries) => {
      const fields = JSON.parse(formEntry.fields);
      const widget = widgets.filter(
        (w: Widget) => w.id === formEntry.widget_id
      )[0];
      if (widget) {
        const register: User = {
          name: "",
          role: "end-user",
          organization_id: organizationsIds[getOrganizationType(widget.id)],
          user_fields: {
            tipo_de_acolhimento: null,
            condition: null,
            state: "",
            city: "",
            neighborhood: "",
            cep: "",
            address: "",
          },
        };
        const instance: Instance = {
          condition: "desabilitada",
        };
        const isIndividual = getOrganizationType(widget.id) === "MSR";

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

        register["user_fields"]["tipo_de_acolhimento"] = setType(
          instance.tipo_de_acolhimento
        );
        register["name"] = instance.last_name
          ? `${instance.first_name} ${instance.last_name}`
          : instance.first_name;

        const geocoding = await getGeocoding(instance);
        Object.keys(geocoding).map((g) => {
          register["user_fields"][g] = geocoding[g];
        });

        if (isIndividual) {
          if (instance.extras.accept_terms === "sim")
            return (register["user_fields"]["condition"] = "inscrita");
        }

        // store instances
        individuals = [...individuals, register];
        syncronizedForms = [...syncronizedForms, formEntry.id];
      }
      return false;
    });

    Promise.all(registers).then(async () => {
      // Batch insert individuals
      console.log("Inserting the new individuals on GraphQL API...");
      console.log({ individuals });
      const users = await insertSolidarityUsers(individuals);
      if (!users) {
        log(
          `Integration failed in these form entries ${cache.map((c) => c.id)}`
        );
        return undefined;
      }
      // Batch update syncronized forms
      console.log("Updating form_entries syncronized on GraphQL API...");
      console.log({ syncronizedForms });
      await updateFormEntries(syncronizedForms);
      cache = [];
      console.log("Integration is done.");
    });
  } else {
    console.log("No items for integration.");
  }
};

export default handleNext;
