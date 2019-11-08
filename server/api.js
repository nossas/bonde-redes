import parse from './parse'
import getAllVolunteerUsers from './hasura/getAllVolunteerUsers'
import getAllIndividualUsers from './hasura/getAllIndividualUsers'
import getAllIndividualTickets from './hasura/getAllIndividualTickets'
import getAllVolunteerTickets from './hasura/getAllVolunteerTickets'

const dicio = {
  therapist: 'Psicóloga',
  lawyer: 'Advogada'
}

// export default main
const main = async (req, res, next) => {
  const {
    serviceType, lat, lng, distance
  } = req.query
  // TODO: change filter
  const services = ['therapist', 'lawyer', 'individual']

  if (!services.includes(serviceType)) {
    return res.status(400).json({ error: 'Query serviceType is invalid' })
  }

  const organizationId = {
    therapist: 360282119532,
    lawyer: 360269610652,
    individual: 360273031591
  }[serviceType]

  if (['therapist', 'lawyer'].includes(serviceType)) {
    const tickets = await getAllVolunteerTickets(organizationId)
    const users = await getAllVolunteerUsers(organizationId, ['disponivel', 'aprovada'])
    if (!users) {
      return console.error('The API returned an error.')
    }

    const filteredUsers = users.map((user) => {
      const filteredTickets = tickets.filter(ticket => ticket.requester_id === user.user_id && ticket.status !== 'deleted')
      const ticket = filteredTickets.find(
        i => i.subject === `[${dicio[serviceType]}] ${user.name} - ${user.registration_number}`
      ) || filteredTickets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]
      return {
        ...user,
        link_ticket: ticket && ticket.ticket_id,
        status_inscricao: ticket && ticket.status_inscricao
      }
    })

    const result = parse(filteredUsers, [lng, lat])
      .filter(user => user.distance < Number(distance))
      .sort((u1, u2) => u1.distance - u2.distance)

    res.json(result)
  } else {
    const tickets = await getAllIndividualTickets(organizationId, 'solicitação_recebida')
    const users = await getAllIndividualUsers(organizationId, 'inscrita')

    if (!tickets || !users) {
      return console.error('The API returned an error.')
    }

    const filteredUsers = users.filter((user) => {
      const newUser = user
      const filteredTickets = tickets.filter(ticket => ticket.requester_id === user.user_id && ticket.status !== 'deleted')
      const ticket = filteredTickets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]
      if (!ticket) {
        return false
      }
      newUser.link_ticket = ticket.ticket_id
      newUser.status_acolhimento = ticket.status_acolhimento
      const tipo = ticket.subject.split(' ').slice(0, 1)[0]
      newUser.tipo_acolhimento = ['[Psicológico]', '[Jurídico]'].includes(tipo) ? tipo.slice(1, -1) : ''

      return filteredTickets.length > 0
    })

    const result = parse(filteredUsers, [lng, lat])
      .filter(user => user.distance < Number(distance))
      .sort((u1, u2) => u1.distance - u2.distance)

    res.json(result)
  }
}

export default main
