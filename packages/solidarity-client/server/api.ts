import parse from './parse'
import getAllUsers from './hasura/getAllUsers'
import getAllTickets from './hasura/getAllTickets'
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
  
  const tickets = await getAllTickets()
  const users = await getAllUsers()

  // doesnt have deleted status and is welcoming ticket
  const isValidTicket = (ticket) => ticket.status !== 'deleted' && getSupportType(ticket.subject).length > 0
  
  const getSupportType = subject => {
    const str = subject.toLowerCase()
    const removeSpecialCaracters = str.replace(/[^\w\s]/ig, '')
    // retorna se no subject existe algum match dos termos 
    const match = removeSpecialCaracters.match(/\b(psicolgico|jurdico|psicloga|advogada)\b/g) 
    return match && match.length > 0 ? match : []
  }
  
  const getUserFromTicket = (ticket) => users.filter(user => user.user_id === ticket.requester_id) 

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
      const user = getUserFromTicket(ticket)[0] || {}
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
