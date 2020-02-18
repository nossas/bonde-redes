import getSolidarityUsers from './hasura/getSolidarityUsers'
import getSolidarityMatches from './hasura/getSolidarityMatches'
import { zendeskOrganizations } from './parse/index'

const main = async (req, res, next) => {
  const INDIVIDUAL = zendeskOrganizations.individual
  const volunteersAvailability = await getSolidarityUsers({
    query: `query ($individual_id: bigint!){
      solidarity_users(
        where: {
          condition: {_eq: "disponivel"},
          longitude: {_is_null: false},
          latitude: {_is_null: false},
          _and: [
            {organization_id: {_neq: $individual_id }},
            {organization_id: {_is_null: false }}
          ]
        }
      ) {
        user_id
        disponibilidade_de_atendimentos
        atendimentos_em_andamento_calculado_
        email
        name
        organization_id
        latitude
        longitude
      }
    }`,
    variables: {
      individual_id: INDIVIDUAL
    }
  })

  const today = new Date()
  const last_month = today.getDate() - 30
  const timestamp = new Date(new Date().setDate(last_month))
  const pendingTickets = await getSolidarityMatches({
    query: `query ($last_month: timestamp!){
      solidarity_matches(
        order_by: {created_at: desc}
        where: {
          created_at: {_gte: $last_month},
          status: {_eq: "encaminhamento__realizado"}
        }
      ) {
        volunteers_user_id,
        volunteers_ticket_id
      }
    }`,
    variables: {
      last_month: timestamp
    }
  })

  // only approved volunteers are available?
  const availableVolunteers = volunteersAvailability
    .map(user => {
      const {
        disponibilidade_de_atendimentos,
        atendimentos_em_andamento_calculado_,
        user_id
      } = user
      const formatAvailability = disponibilidade_de_atendimentos !== '5_ou_mais'
        ? Number(disponibilidade_de_atendimentos)
        : 5
      const forwardings_last_30_days = pendingTickets.filter(ticket => ticket.volunteers_user_id === user_id)
      const countForwardings = forwardings_last_30_days.length
      const availability = formatAvailability - (countForwardings + atendimentos_em_andamento_calculado_)

      return {
        ...user,
        pending: countForwardings,
        availability
      }
    })
  .filter(user => user.availability > 0)

  res.json(availableVolunteers)
}

export default main
