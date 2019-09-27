import axios from 'axios'
import { Ticket } from '../interfaces/Ticket'
import dbg from './dbg'
import stringigyObject from 'stringify-object'
import * as yup from 'yup'

const stringify = (obj: any) => {
  return stringigyObject(obj, {
    singleQuotes: false, transform: (obj, prop, originalResult) => {
      if (prop === 'description') {
        return JSON.stringify(originalResult)
      } else {
        return originalResult
      }
    }
  })
}

const query = (tickets: any) => `mutation {
  insert_solidarity_tickets(objects: ${stringify(tickets)}, on_conflict: {
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
  id: yup.number(),
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

const saveTickets = async (tickets: Ticket[]) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const validatedTickets = (await validate.validate(tickets, { stripUnknown: true }))
  // console.log(query(validatedTickets))
  const response = await axios.post(HASURA_API_URL, {
    query: query(validatedTickets)
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  response.data.errors && dbg(response.data.errors)

  return response
}

export default saveTickets
