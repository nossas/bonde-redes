import parse from './parse'
import getAllVolunteerUsers from './hasura/getAllVolunteerUsers'
import getAllIndividualUsers from './hasura/getAllIndividualUsers'
import getAllIndividualTickets from './hasura/getAllIndividualTickets'
import getAllVolunteerTickets from './hasura/getAllVolunteerTickets'

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
    const tickets = await getAllVolunteerTickets(organizationId, ['aprovada', 'aprovada_e_validada'])
    const users = await getAllVolunteerUsers(organizationId, 'disponivel')
    if (!users) {
      return console.error('The API returned an error.')
    }

    const filteredUsers = users.flatMap((user) => {
      const filteredTikets = tickets.filter(ticket => ticket.requester_id === user.user_id)
      return [{
        ...user,
        link_ticket: filteredTikets.map(ticket => ticket.ticket_id),
        status_inscricao: filteredTikets.map(ticket => ticket.status_inscricao)
      }]
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

    const filteredUsers = users.flatMap((user) => {
      const filteredTikets = tickets.filter(ticket => ticket.requester_id === user.user_id)
      return filteredTikets.length > 0 ? [{
        ...user,
        link_ticket: filteredTikets.map(ticket => ticket.ticket_id),
        status_acolhimento: filteredTikets.map(ticket => ticket.status_acolhimento)
      }] : []
    })

    const result = parse(filteredUsers, [lng, lat])
      .filter(user => user.distance < Number(distance))
      .sort((u1, u2) => u1.distance - u2.distance)

    res.json(result)
  }
}

export default main
