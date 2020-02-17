import { zendeskOrganizations } from '../parse/index'
import getSolidarityUsers from '../hasura/getSolidarityUsers'
import getSolidarityTickets from '../hasura/getSolidarityTickets'

const INDIVIDUAL = zendeskOrganizations.individual

export const getAllUsers = getSolidarityUsers({
  query: `query {
    solidarity_users(
      where: {
      longitude: {_is_null: false}, 
      latitude: {_is_null: false},
      organization_id: {_is_null: false}
      }
    ) {
      address
      organization_id
      user_id
      atendimentos_concludos_calculado_
      atendimentos_em_andamento_calculado_
      disponibilidade_de_atendimentos
      latitude
      longitude
      email
      encaminhamentos
      encaminhamentos_realizados_calculado_
      name
      phone
      registration_number
      occupation_area
      whatsapp
      data_de_inscricao_no_bonde
      condition
      tipo_de_acolhimento
    }
	}`
})

export const getAllTickets = getSolidarityTickets({
	query: `query {
		solidarity_tickets(
			where: {
				status: {_neq: "deleted"}
			}
		) {
			requester_id
			status_inscricao
			status_acolhimento
			ticket_id
			created_at
			status
			subject
		}
	}`
})

export const getIndividualUsers = getSolidarityUsers({
	query: `query ($individual_id: bigint!){
		solidarity_users(
			where: {
				longitude: {_is_null: false},
				latitude: {_is_null: false},
				organization_id: {_eq: $individual_id}
			}
		)
		{
			organization_id
			user_id
			latitude
			longitude
			email
			name
			phone
			data_de_inscricao_no_bonde
			tipo_de_acolhimento
			address
		}
	}`,
	variables: {
		individual_id: INDIVIDUAL
	}
})

export const getIndividualTickets = getSolidarityTickets({
	query: `query {
		solidarity_tickets(
			where: {
				_or: [
					{status: {_eq: "open"}},
					{status: {_eq: "new"}}
				],
				status_acolhimento: {_eq: "solicitação_recebida"},
				status: {_neq: "deleted"}
			}
		) {
			status_acolhimento
			status
			subject
			ticket_id
			requester_id
			created_at
		}
	}`
})