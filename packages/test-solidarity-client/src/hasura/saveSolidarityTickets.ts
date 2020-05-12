import axios from "axios";
import { TicketZendesk, TicketHasuraIn } from "../interfaces/Ticket";

const generateVariables = `
$assignee_id: bigint,
$created_at: timestamp,
$custom_fields: jsonb,
$description: String,
$group_id: bigint,
$ticket_id: bigint,
$organization_id: bigint,
$raw_subject: String,
$requester_id: bigint,
$status: String,
$subject: String,
$submitter_id: bigint,
$tags: jsonb,
$updated_at: timestamp,
$community_id: Int
`;
const generateObject = `
assignee_id: $assignee_id,
created_at: $created_at,
custom_fields: $custom_fields,
description: $description,
group_id: $group_id,
ticket_id: $ticket_id,
organization_id: $organization_id,
raw_subject: $raw_subject,
requester_id: $requester_id,
status: $status,
subject: $subject,
submitter_id: $submitter_id,
tags: $tags,
updated_at: $updated_at,
community_id: $community_id
`;

const SAVE_SOLIDARITY_TICKET_MUTATION = `mutation createSolidarityTicket(${generateVariables}){
  insert_solidarity_tickets(objects: { ${generateObject} }, on_conflict: {
    constraint: solidarity_tickets_ticket_id_key
    update_columns: [
      assignee_id
      created_at
      custom_fields
      description
      group_id
      organization_id
      raw_subject
      requester_id
      status
      subject
      submitter_id
      tags
      ticket_id
      updated_at
      status_acolhimento
      nome_voluntaria
      link_match
      nome_msr
      data_inscricao_bonde
      data_encaminhamento
      status_inscricao
      telefone
      estado
      cidade
      community_id
    ]})
  {
    affected_rows
    returning {
      id
    }
  }
}`;

const saveTickets = async (ticket: TicketZendesk) => {
  const {
    HASURA_API_URL = "",
    X_HASURA_ADMIN_SECRET,
    COMMUNITY_ID
  } = process.env;

  const customTicket: TicketHasuraIn = {
    community_id: Number(COMMUNITY_ID),
    ticket_id: ticket.id,
    assignee_id: ticket.assignee_id,
    created_at: ticket.created_at,
    custom_fields: ticket.custom_fields,
    description: ticket.description,
    group_id: ticket.group_id,
    organization_id: ticket.organization_id,
    raw_subject: ticket.raw_subject,
    requester_id: ticket.requester_id,
    status: ticket.status,
    subject: ticket.subject,
    submitter_id: ticket.submitter_id,
    tags: ticket.tags,
    updated_at: ticket.updated_at
  };

  const response = await axios.post(
    HASURA_API_URL,
    {
      query: SAVE_SOLIDARITY_TICKET_MUTATION,
      variables: { ...customTicket }
    },
    {
      headers: {
        "x-hasura-admin-secret": X_HASURA_ADMIN_SECRET
      }
    }
  );

  console.log("query", response.config.data, "error", response.data);

  if (response.data.errors) {
    return response.data.errors;
  }

  return response.data.data.insert_solidarity_tickets.affected_rows === 1;
};

export default saveTickets;
