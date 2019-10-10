import dbg from "./dbg"
import { Response } from 'express'
import handleIncomingTicket from "./app/handleIncomingTicket"
import { IncomingRequestData } from "./interfaces/IncomingRequestData"
import verifyOrganization from "./app/verifyOrganizations"
import { ORGANIZATIONS } from "./interfaces/Organizations"
import getAllUsersLocalizations from "./hasura/getAllUsersLocalizations"
import { getDistance } from 'geolib'
import verifyVolunteer, { VERIFY_VOLUNTEER_STATUS } from "./app/verifyVolunteer"
import verifyIndividual, { VERIFY_MSR_STATUS } from "./app/verifyIndividual"
import { UserFromTicket } from "./hasura/getUserFromTicket"
import { Ticket } from "./interfaces/Ticket"
import createTicket from "./zendesk/createTicket"
import R from 'ramda'

const log = dbg.extend('app')

const createTicketFlux = async (volunteer: UserFromTicket, individual: UserFromTicket) => {
  const volunteer_ticket: Partial<Ticket> = {
    nome_msr: individual.name,
    nome_voluntaria: volunteer.name,
    status_acolhimento: 'encaminhamento__realizado'
  }

  const individual_ticket: Partial<Ticket> = {
    nome_msr: individual.name,
    nome_voluntaria: volunteer.name,
    status_acolhimento: 'encaminhamento__realizado'
  }

  await createTicket(individual_ticket)
  await createTicket(volunteer_ticket)
}

const App = async (data: IncomingRequestData, res: Response) => {
  const ticket = handleIncomingTicket(data)
  log(`incoming ticket with id '${ticket.ticket_id}'`)

  const organization = await verifyOrganization(ticket.organization_id)
  if (organization === null) {
    log(`failed to handle organization for ticket '${ticket.ticket_id}'`)
    return res.status(500).json(`failed to handle organization`)
  }

  let volunteer: UserFromTicket | undefined
  let individual: UserFromTicket | undefined
  let availableOpenings = 0

  if (organization !== ORGANIZATIONS.MSR) {
    const status = await verifyVolunteer(ticket)
    switch (status.status) {
      case VERIFY_VOLUNTEER_STATUS.HAVE_NO_MATCHES:
        log('have no matches')
        return
      case VERIFY_VOLUNTEER_STATUS.NOT_AVAILABLE:
        log('not available')
        return
      case VERIFY_VOLUNTEER_STATUS.NOT_FOUND:
        log('not found')
        return
      case VERIFY_VOLUNTEER_STATUS.STATUS_NOT_AVAILABLE:
        log('status not available')
        return
      default:
        volunteer = status.user
        availableOpenings = status.availableOpenings
    }

  } else {
    const status = await verifyIndividual(ticket)
    switch (status.status) {
      case VERIFY_MSR_STATUS.NOT_FOUND:
        log('msr not found')
        return
      case VERIFY_MSR_STATUS.FAILED_TIPO_ACOLHIMENTO:
        log('msr failed tipo acolhimento')
        return
      case VERIFY_MSR_STATUS.STATUS_NOT_INSCRIBED:
        log('msr status not inscribed')
        return
      case VERIFY_MSR_STATUS.TICKET_INVALID_STATUS:
        log('msr ticket invalid status')
        return
      default:
        individual = status.user
    }

  }

  const userLocalizations = await getAllUsersLocalizations()
  if (!userLocalizations) {
    log('user localizations failed')
    return
  }
  
  // const asd = userLocalizations.filter(i => i.user_id === 388369061372)

  const usersWhichDistanceMatches = await Promise.all(userLocalizations.map(async i => {
    if (
      i.latitude === undefined ||
      i.longitude === undefined ||
      i.organization === undefined
    ) {
      log('no latitude, or longitude, or organization', i)
      return []
    }

    let distance: number

    if (volunteer) {
      if (i.organization !== ORGANIZATIONS.MSR) {
        log(`${i.user_id} not msr`)
        return []
      }
      if (
        i.tipo_de_acolhimento === 'jurídico' && organization === ORGANIZATIONS.PSICOLOGA
        || i.tipo_de_acolhimento === 'psicológico' && organization === ORGANIZATIONS.ADVOGADA
      ) {
        log(`${i.user_id} wants diferent type of attendance`)
        return []
      }
      const status = await verifyIndividual(ticket, i)
      switch (status.status) {
        case VERIFY_MSR_STATUS.NOT_FOUND:
          log(`${i.user_id} not found`)
          return []
        case VERIFY_MSR_STATUS.FAILED_TIPO_ACOLHIMENTO:
          log(`${i.user_id} failed tipo acolhimento`)
          return []
        case VERIFY_MSR_STATUS.STATUS_NOT_INSCRIBED:
          log(`${i.user_id} status not inscribed`)
          return []
        case VERIFY_MSR_STATUS.TICKET_INVALID_STATUS:
          log(`${i.user_id} tiucket invalid status`)
          return []
      }
      distance = getDistance({
        latitude: volunteer.latitude,
        longitude: volunteer.longitude
      }, {
        latitude: i.latitude,
        longitude: i.longitude
      })
    } else if (individual) {
      if (i.organization !== ORGANIZATIONS.ADVOGADA && i.organization !== ORGANIZATIONS.PSICOLOGA) {
        log(`not a lawyer or a psychologist`)
        return []
      }
      if (
        individual.tipo_de_acolhimento === 'jurídico' && i.organization === ORGANIZATIONS.PSICOLOGA
        || individual.tipo_de_acolhimento === 'psicológico' && i.organization === ORGANIZATIONS.ADVOGADA
      ) {
        log(`${i.user_id} wants diferent type of attendance`)
        return []
      }
      const status = await verifyVolunteer(ticket, i)
      switch (status.status) {
        case VERIFY_VOLUNTEER_STATUS.HAVE_NO_MATCHES:
          log(`${i.user_id} have no matches`)
          return []
        case VERIFY_VOLUNTEER_STATUS.NOT_AVAILABLE:
          log(`${i.user_id} not available`)
          return []
        case VERIFY_VOLUNTEER_STATUS.NOT_FOUND:
          log(`${i.user_id} not found`)
          return []
        case VERIFY_VOLUNTEER_STATUS.STATUS_NOT_AVAILABLE:
          log(`${i.user_id} status not available`)
          return []
        default:
          volunteer = status.user
          availableOpenings = status.availableOpenings
      }
      distance = getDistance({
        latitude: individual.latitude,
        longitude: individual.longitude
      }, {
        latitude: i.latitude,
        longitude: i.longitude
      })
    } else {
      return []
    }

    log(`distance: ${distance}`)

    return distance < 20000 ? [{ ...i, distance }] : []
  }))

  const user = volunteer || individual
  if (!user) {
    return []
  }

  (availableOpenings > 0) && R.take(availableOpenings, usersWhichDistanceMatches.flat()).forEach(i => {
    log(`Gotcha! Creating tickets between users '${user.user_id}' and '${i.user_id}', distance '${i.distance}'`)
    if (process.env.CREATE_TICKETS === 'true') {
      volunteer && createTicketFlux(volunteer, i)
      individual && createTicketFlux(i, individual)
    }
  })

  return res.status(200).json('Ok!')
}

export default App
