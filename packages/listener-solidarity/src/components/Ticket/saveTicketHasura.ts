import { insertSolidarityTickets } from "../../graphql/mutations";
import { handleTicketError } from "../../utils";
import { Ticket } from "../../types";
import dbg from "../../dbg";

const log = dbg.extend("saveZendeskTickets");

type CustomFields = {
  status_acolhimento?: string;
  data_inscricao_bonde?: string;
  nome_msr?: string;
  nome_voluntaria?: null;
  link_match?: null;
  data_encaminhamento?: null;
  status_inscricao?: null;
  telefone?: null;
  estado?: null;
  cidad?: null;
};

const dicio = {
  360014379412: "status_acolhimento",
  360016631592: "nome_voluntaria",
  360016631632: "link_match",
  360016681971: "nome_msr",
  360017056851: "data_inscricao_bonde",
  360017432652: "data_encaminhamento",
  360021665652: "status_inscricao",
  360021812712: "telefone",
  360021879791: "estado",
  360021879811: "cidade"
};

export default async (ticket: Ticket) => {
  log("Preparing ticket to be saved in Hasura");
  const custom_fields: CustomFields = ticket.custom_fields.reduce(
    (newObj, old) => {
      const key = dicio[old.id] && dicio[old.id];
      return {
        ...newObj,
        [key]: old.value
      };
    },
    {}
  );

  const hasuraTicket = {
    ...custom_fields,
    created_at: ticket.created_at,
    custom_fields: ticket.custom_fields,
    description: ticket.description,
    organization_id: ticket.organization_id,
    raw_subject: ticket.raw_subject,
    status: ticket.status,
    submitter_id: ticket.submitter_id,
    tags: ticket.tags,
    updated_at: ticket.updated_at,
    ticket_id: ticket.id,
    community_id: Number(process.env.COMMUNITY_ID)
  };

  // log({ hasuraTicket: JSON.stringify(hasuraTicket, null, 2) });
  log("Saving ticket in Hasura...");
  const inserted = await insertSolidarityTickets(hasuraTicket);
  if (!inserted) return handleTicketError(ticket);
  return log("Ticket integration is done.");
};
