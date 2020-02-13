import getAllUsers from './hasura/getAllUsers'
import getIndividualUsers from './hasura/getIndividualUsers'
import getAllTickets from './hasura/getAllTickets'
import getIndividualTickets from './hasura/getIndividualTickets'
import { zendeskOrganizations } from './parse/index'

const main = async (req, res, next) => {
  const dicio = (organizationId) => {
    const keys = Object.keys(zendeskOrganizations)
    const key = keys.findIndex(i => zendeskOrganizations[i] === organizationId)
    return ({
      therapist: 'Psicóloga',
      lawyer: 'Advogada'
    })[keys[key]]
  }

  const INDIVIDUAL = zendeskOrganizations.individual
  const api = req.route.path === '/api/all'
    ? { tickets: getAllTickets, users: getAllUsers }
    : { tickets: getIndividualTickets, users: () => getIndividualUsers(INDIVIDUAL.toString()) }

  const tickets = await api.tickets()
  const users = await api.users()

  const getUserFromTicket = (ticket) => users.filter(user => user.user_id === ticket.requester_id) 

  // is welcoming ticket and ticket has user (according to user hasura query)
  const isValidTicket = (ticket) => {
    return getSupportType(ticket.subject).length > 0 &&
    getUserFromTicket(ticket).length > 0
  }
  
  const getSupportType = subject => {
    const str = subject.toLowerCase()
    const removeSpecialCaracters = str.replace(/[^\w\s]/ig, '')
    // retorna se no subject existe algum match dos termos 
    const match = removeSpecialCaracters.match(/\b(psicolgico|jurdico|psicloga|advogada)\b/g) 
    return match && match.length > 0 ? match : []
  }

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

  const ticketsWithUser = tickets
    .filter(ticket => isValidTicket(ticket))
    .map(ticket => {
      const user = getUserFromTicket(ticket)[0]
      return {
        ...ticket,
        ...user,
        ticket_status: ticket.status,
        ticket_created_at: ticket.created_at,
        tipo_de_acolhimento: getTicketType(user.tipo_de_acolhimento, ticket.subject),
      }
    })

  res.json(ticketsWithUser)
}

export default main
