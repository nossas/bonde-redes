import axios from 'axios'
import { Ticket } from './cli'

const mutation = `mutation (
  $assignee_id: bigint
  $created_at: timestamp
  $custom_fields: jsonb
  $description: String
  $group_id: bigint
  $ticket_id: bigint
  $organization_id: bigint
  $raw_subject: String
  $requester_id: bigint
  $status: String
  $subject: String
  $submitter_id: bigint
  $tags: jsonb
  $updated_at: timestamp
  $status_acolhimento: String
  $nome_voluntaria: String
  $link_match: String
  $nome_msr: String
  $data_inscricao_bonde: timestamp
  $data_encaminhamento: timestamp
  $status_inscricao: String
  $telefone: String
  $estado:String
  $cidade: String
  $community_id: bigint
) {
  insert_solidarity_tickets(objects: {
    assignee_id: $assignee_id
    created_at: $created_at
    custom_fields: $custom_fields
    description: $description
    group_id: $group_id
    ticket_id: $ticket_id
    organization_id: $organization_id
    raw_subject: $raw_subject
    requester_id: $requester_id
    status: $status
    subject: $subject
    submitter_id: $submitter_id
    tags: $tags
    updated_at: $updated_at
    status_acolhimento: $status_acolhimento
    nome_voluntaria: $nome_voluntaria
    link_match: $link_match
    nome_msr: $nome_msr
    data_inscricao_bonde: $data_inscricao_bonde
    data_encaminhamento: $data_encaminhamento
    status_inscricao: $status_inscricao
    telefone: $telefone
    estado: $estado
    cidade: $cidade
    community_id: $community_id
  }, on_conflict: {
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
  id,
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
    }
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  return response
}

export default saveTicket
