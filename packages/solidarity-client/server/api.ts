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

  const isVolunteer = ({ organization_id }) => [zendeskOrganizations['therapist'], zendeskOrganizations['lawyer']].includes(organization_id)
  const filterDeletedTickets = ({ user_id }) => tickets.filter(ticket => ticket.requester_id === user_id && ticket.status !== 'deleted')
  const fuseUserWithTicket = ({ status_inscricao = '-', status_acolhimento = '-', status = '-', ticket_id = '-' }, user) => ({
    ...user,
    status_inscricao,
    status_acolhimento,
    ticket_status: status,
    ticket_id
  })

  const objectValidation = value => typeof value !== 'undefined' ? value : {}

  const usersWithTickets = users.map((user) => {
    if (isVolunteer(user)) {
      const ticket = filterDeletedTickets(user).find(
        i => i.subject === `[${dicio(user.organizationId)}] ${user.name} - ${user.registration_number}`
      ) || filterDeletedTickets(user)
        .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))[0]

      return fuseUserWithTicket(objectValidation(ticket), user)
    } else {
      const ticket = filterDeletedTickets(user)
        .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))[0]

      // if (!ticket) return user

      // user.link_ticket = ticket.ticket_id
      // user.status_acolhimento = ticket.status_acolhimento
      //const tipo = ticket.subject.split(' ').slice(0, 1)[0]
      //user.tipo_de_acolhimento   = ['[psicológico]', '[jurídico]'].includes(tipo)
      //  ? tipo.slice(1, -1)
      // : ''

      return fuseUserWithTicket(objectValidation(ticket), user)
    }
  })

  res.json(usersWithTickets)
}

export default main
