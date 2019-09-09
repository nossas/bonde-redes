import axios from 'axios'
import { Ticket } from '../Server'

const mutation = `mutation ($assignee_id: bigint, $created_at: timestamp, $custom_fields: jsonb, $description: String, $group_id: bigint, $ticket_id: bigint, $organization_id: bigint, $raw_subject: String, $requester_id: bigint, $status: String, $subject: String, $submitter_id: bigint, $tags: jsonb, $updated_at: timestamp) {
  insert_zendesk_tickets(objects: {assignee_id: $assignee_id, created_at: $created_at, custom_fields: $custom_fields, description: $description, group_id: $group_id, ticket_id: $ticket_id, organization_id: $organization_id, raw_subject: $raw_subject, requester_id: $requester_id, status: $status, subject: $subject, submitter_id: $submitter_id, tags: $tags, updated_at: $updated_at}, on_conflict: {constraint: zendesk_tickets_ticket_id_key, update_columns: [assignee_id, created_at, custom_fields, description, group_id, organization_id, raw_subject, requester_id, status, subject, submitter_id, tags, ticket_id, updated_at]}) {
    affected_rows
  }
}`

const saveTickets = async ({
  assignee_id,
  created_at,
  custom_fields,
  description,
  group_id,
  id,
  organization_id,
  raw_subject,
  requester_id,
  status,
  subject,
  submitter_id,
  tags,
  updated_at
}: Ticket) => {
  const {HASURA_API_URL, X_HASURA_ADMIN_SECRET} = process.env
  const response = await axios.post(HASURA_API_URL, {
    query: mutation,
    variables: {
      assignee_id,
      created_at,
      custom_fields,
      description,
      group_id,
      ticket_id: id,
      organization_id,
      raw_subject,
      requester_id,
      status,
      subject,
      submitter_id,
      tags,
      updated_at
    }
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  return response
}

export default saveTickets
