import axios from 'axios'
import { Ticket } from '../interfaces/Ticket'
import stringify from '../stringify'

const query = (users: any) => `mutation {
  insert_solidarity_tickets(objects: ${stringify(users)}, on_conflict: {
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
    ]
  }) {
    affected_rows
  }
}`

const saveTicket = async ({
  assignee_id,
  created_at,
  custom_fields,
  description,
  group_id,
  ticket_id,
  organization_id,
  raw_subject,
  requester_id,
  status,
  subject,
  submitter_id,
  tags,
  updated_at,
  status_acolhimento,
  nome_voluntaria,
  link_match,
  nome_msr,
  data_inscricao_bonde,
  data_encaminhamento,
  status_inscricao,
  telefone,
  estado,
  cidade,
  community_id
}: Ticket) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL, {
    query: query({
      assignee_id,
      created_at,
      custom_fields,
      description,
      group_id,
      ticket_id,
      organization_id,
      raw_subject,
      requester_id,
      status,
      subject,
      submitter_id,
      tags,
      updated_at,
      status_acolhimento,
      nome_voluntaria,
      link_match,
      nome_msr,
      data_inscricao_bonde,
      data_encaminhamento,
      status_inscricao,
      telefone,
      estado,
      cidade,
      community_id
    }),
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  response.data.errors && console.log(response.data.errors)

  return response
}

export default saveTicket
