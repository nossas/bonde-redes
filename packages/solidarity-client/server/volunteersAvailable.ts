import getVolunteersAvailability from './hasura/getVolunteersAvailability'
import getPendingTickets from './hasura/getPendingTickets'
import { zendeskOrganizations } from './parse/index'

const main = async (req, res, next) => {
  const volunteersAvailability = await getVolunteersAvailability()

  const today = new Date()
  const last_month = today.getDate() - 30
  const timestamp = new Date(new Date().setDate(last_month))
  const pendingTickets = await getPendingTickets(timestamp)

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
