
import { zendeskOrganizations } from '../parse/index'
import { 
  getAllTickets, 
  getAllUsers, 
  getIndividualTickets, 
  getIndividualUsers 
} from './hasura'
import { isValidTicket, getUserFromTicket, getSupportType } from '../utils'

const getTicketType = (type, subject) => {
  if (type === 'psicológico_e_jurídico') {
    const match = getSupportType(subject)
    if (match.length > 0) {
      return match[0] === 'jurdico'
        ? 'jurídico'
        : 'psicológico'  
    }
  }
  return typeof type !== 'undefined' ? type : '-'
}

const main = async (req, res, next) => {
  const api = req.route.path === '/api/all'
  ? { tickets: () => getAllTickets, users: () => getAllUsers }
  : { tickets: () => getIndividualTickets, users: () => getIndividualUsers }

  const tickets = await api.tickets()
  const users = await api.users()

  const ticketsWithUser = tickets
    .filter(ticket => isValidTicket(users, ticket))
    .map(ticket => {
      const user = getUserFromTicket(users, ticket)[0]
      return {
        ...ticket,
        ...user,
        ticket_status: ticket.status,
        ticket_created_at: ticket.created_at,
        tipo_de_acolhimento: getTicketType(user.tipo_de_acolhimento, ticket.subject)
      }
    })

  res.json(ticketsWithUser)
}

export default main
