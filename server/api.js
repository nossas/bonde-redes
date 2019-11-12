import parse from './parse'
import getAllUsers from './hasura/getAllUsers'
import getAllTickets from './hasura/getAllTickets'

const main = async (req, res, next) => {
  const zendeskOrganizations = JSON.parse(process.env.REACT_APP_ZENDESK_ORGANIZATIONS)
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

  const usersWithTickets = users.map((user) => {
    const filteredTickets = tickets.filter(ticket => ticket.requester_id === user.user_id && ticket.status !== 'deleted')
    if ([zendeskOrganizations['therapist'], zendeskOrganizations['lawyer']].includes(user.organization_id)) {
      const ticket = filteredTickets.find(
        i => i.subject === `[${dicio(user.organizationId)}] ${user.name} - ${user.registration_number}`
      ) || filteredTickets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]

      return {
        ...user,
        link_ticket: ticket && ticket.ticket_id,
        status_inscricao: ticket && ticket.status_inscricao
      }
    } else {
      const ticket = filteredTickets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]
      if (!ticket) {
        return user
      }
      user.link_ticket = ticket.ticket_id
      user.status_acolhimento = ticket.status_acolhimento
      const tipo = ticket.subject.split(' ').slice(0, 1)[0]
      user.tipo_acolhimento = ['[Psicológico]', '[Jurídico]'].includes(tipo) ? tipo.slice(1, -1) : ''
      return user
    }
  })

  res.json(usersWithTickets)
}

export default main
