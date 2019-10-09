import axios from 'axios'
import { Ticket } from '../interfaces/Ticket'
import dbg from './dbg'
import * as yup from 'yup'
import { generateRequestVariables } from './base'
import { isError, HasuraResponse } from '../interfaces/HasuraResponse'

const generateVariablesIndex = (index: number) => `
$assignee_id_${index}: bigint
$created_at_${index}: timestamp
$custom_fields_${index}: jsonb
$description_${index}: String
$group_id_${index}: bigint
$ticket_id_${index}: bigint
$organization_id_${index}: bigint
$raw_subject_${index}: String
$requester_id_${index}: bigint
$status_${index}: String
$subject_${index}: String
$submitter_id_${index}: bigint
$tags_${index}: jsonb
$updated_at_${index}: timestamp
$status_acolhimento_${index}: String
$nome_voluntaria_${index}: String
$link_match_${index}: String
$nome_msr_${index}: String
$data_inscricao_bonde_${index}: String
$data_encaminhamento_${index}: String
$status_inscricao_${index}: String
$telefone_${index}: String
$estado_${index}:String
$cidade_${index}: String
$community_id_${index}: Int
`
const generateObjectsIndex = (index: number) => `
assignee_id: $assignee_id_${index}
created_at: $created_at_${index}
custom_fields: $custom_fields_${index}
description: $description_${index}
group_id: $group_id_${index}
ticket_id: $ticket_id_${index}
organization_id: $organization_id_${index}
raw_subject: $raw_subject_${index}
requester_id: $requester_id_${index}
status: $status_${index}
subject: $subject_${index}
submitter_id: $submitter_id_${index}
tags: $tags_${index}
updated_at: $updated_at_${index}
status_acolhimento: $status_acolhimento_${index}
nome_voluntaria: $nome_voluntaria_${index}
link_match: $link_match_${index}
nome_msr: $nome_msr_${index}
data_inscricao_bonde: $data_inscricao_bonde_${index}
data_encaminhamento: $data_encaminhamento_${index}
status_inscricao: $status_inscricao_${index}
telefone: $telefone_${index}
estado: $estado_${index}
cidade: $cidade_${index}
community_id: $community_id_${index}
`

const generateVariables = (tickets: Ticket[]) => tickets.map((_, index) => generateVariablesIndex(index)).flat()

const generateObjects = (tickets: Ticket[]) => `[${tickets.map((_, index) => `{${generateObjectsIndex(index)}}`).join(',')}]`

const createQuery = (tickets: any) => `mutation (${generateVariables(tickets)}){
  insert_solidarity_tickets(objects: ${generateObjects(tickets)}, on_conflict: {
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

const validate = yup.array().of(yup.object().shape({
  id: yup.number().strip(true),
  ticket_id: yup.number().required(),
  assignee_id: yup.number().nullable(),
  created_at: yup.string(),
  custom_fields: yup.array().of(yup.object().shape({
    id: yup.number(),
    value: yup.string().nullable()
  })),
  description: yup.string(),
  group_id: yup.number().nullable(),
  organization_id: yup.number().nullable(),
  raw_subject: yup.string(),
  requester_id: yup.number(),
  status: yup.string(),
  subject: yup.string(),
  submitter_id: yup.number(),
  tags: yup.mixed(),
  updated_at: yup.string(),
  status_acolhimento: yup.string().nullable(),
  nome_voluntaria: yup.string().nullable(),
  link_match: yup.string().nullable(),
  nome_msr: yup.string().nullable(),
  data_inscricao_bonde: yup.string().nullable(),
  data_encaminhamento: yup.string().nullable(),
  status_inscricao: yup.string().nullable(),
  telefone: yup.string().nullable(),
  estado: yup.string().nullable(),
  cidade: yup.string().nullable(),
  community_id: yup.number(),
  webhooks_registry_id: yup.number(),
}))

const log = dbg.extend('saveTickets')

interface Response {
  affected_rows: number
}

const saveTickets = async (tickets: Ticket[]) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const validatedTickets = (await validate.validate(tickets, { stripUnknown: true }))
  const response = await axios.post<HasuraResponse<'insert_solidarity_tickets', Response>>(HASURA_API_URL, {
    query: createQuery(validatedTickets),
    variables: generateRequestVariables(validatedTickets)
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  if (isError(response.data)) {
    return log(response.data.errors)
  }

  return response.data.data.insert_solidarity_tickets.affected_rows
}

export default saveTickets
