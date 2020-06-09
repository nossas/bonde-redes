import axios from "axios";
import * as yup from "yup";
import debug from "debug";

const query = `query($advogadaId: Int!, $psicologaId: Int!) {
  form_entries(where: {widget_id: {_in: [$advogadaId, $psicologaId]}}) {
    fields
    created_at
    widget_id
  }
}`;

interface FormEntry {
  fields: string;
  created_at: string;
  widget_id: number;
}

interface DataType {
  data: {
    form_entries: FormEntry[];
  };
}

class BondeCreatedDate {
  email: string;

  name: string | null;

  cep: string | null;

  dbg = debug("webhooks-mautic-zendesk-BondeCreatedDate");

  constructor(email: string, name: string | null, cep: string | null) {
    this.email = email;
    this.name = name;
    this.cep = cep;
  }

  getFormEntries = async () => {
    const { HASURA_API_URL, X_HASURA_ADMIN_SECRET, WIDGET_IDS } = process.env;
    let widget_ids;
    try {
      widget_ids = JSON.parse(WIDGET_IDS);
      if (
        !yup
          .object()
          .shape({
            ADVOGADA: yup.number().required(),
            PSICÓLOGA: yup.number().required()
          })
          .isValid(widget_ids)
      ) {
        throw new Error("Invalid WIDGET_IDS env var");
      }
    } catch (e) {
      return this.dbg(e);
    }
    try {
      const data = await axios.post<DataType>(
        HASURA_API_URL!,
        {
          query,
          variables: {
            advogadaId: widget_ids.ADVOGADA,
            psicologaId: widget_ids["PSICÓLOGA"]
          }
        },
        {
          headers: {
            "x-hasura-admin-secret": X_HASURA_ADMIN_SECRET
          }
        }
      );
      return data.data.data.form_entries;
    } catch (e) {
      return this.dbg(e);
    }
  };

  filterByEmail = (formEntries: FormEntry[]) =>
    formEntries.filter(i => {
      try {
        const parsedFields = JSON.parse(i.fields);
        return parsedFields[2].value === this.email;
      } catch (e) {
        return false;
      }
    });

  start = async () => {
    const formEntries = await this.getFormEntries();
    if (!formEntries) {
      return this.dbg("getFormEntries error");
    }
    const filteredFormEntries = await this.filterByEmail(formEntries);
    if (!filteredFormEntries) {
      return this.dbg("filteredFormEntries error");
    }

    try {
      const [
        { value: name },
        { value: lastname },
        _,
        __,
        { value: cep }
      ] = JSON.parse(filteredFormEntries[0].fields);
      const aux = {
        createdAt: filteredFormEntries[0].created_at,
        name:
          typeof this.name !== "string" || this.name.length === 0
            ? `${name} ${lastname}`
            : this.name,
        cep:
          typeof this.cep !== "string" || this.cep?.length === 0
            ? String(cep)
            : this.cep
      };
      return aux;
    } catch {
      this.dbg(`formEntries not found for email ${this.email}`);
      return {
        createdAt: new Date().toString(),
        name: this.name || "sem nome",
        cep: this.cep ?? undefined
      };
    }
  };
}

export default BondeCreatedDate;
