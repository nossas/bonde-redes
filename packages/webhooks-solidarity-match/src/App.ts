import dbg from "./dbg"
import {Response} from 'express'
import handleIncomingTicket from "./app/handleIncomingTicket"
import { IncomingRequestData } from "./interfaces/IncomingRequestData"
import verifyOrganization from "./app/verifyOrganizations"
import { ORGANIZATIONS } from "./interfaces/Organizations"
import getUserFromTicket from "./hasura/getUserFromTicket"
import User from "./interfaces/User"
import getRecentMatches from "./hasura/getRecentMatches"

const log = dbg.extend('app')

const App = async (data: IncomingRequestData, res: Response) => {
  const ticket = handleIncomingTicket(data)
  log(`incoming ticket with id '${ticket.ticket_id}'`)

  const organization = await verifyOrganization(ticket)
  if (organization === null) {
    log(`failed to handle organization for ticket '${ticket.ticket_id}'`)
    return res.status(500).json(`failed to handle organization`)
  }

  let isAvailable = false

  try {
    // Checando disponibilidade
    if ([ORGANIZATIONS.ADVOGADA, ORGANIZATIONS.PSICOLOGA].includes(organization)) {
      const users = await getUserFromTicket(ticket.requester_id) as [User]
      if (!users || users.length !== 1) {
        log(`User '${ticket.requester_id}' not found for ticket '${ticket.ticket_id}'.`)
        return res.status(500).json('User not found.')
      }
  
      const [user] = users
      if (user.condition !== 'disponivel') {
        log(`User '${ticket.requester_id}' doesn't have available status. Ticket '${ticket.ticket_id}'.`)
        return res.status(200).json(`Requester isn't available`)
      }

      const matchesFromVolunteer = await getRecentMatches(ticket.requester_id)
      if (!matchesFromVolunteer) {
        return
      }

      const dateThirtyDaysBefore = new Date(new Date().setDate(new Date().getDate()-30))
      const recentMatchesFromVolunteer = matchesFromVolunteer.filter(i => dateThirtyDaysBefore < new Date(i.created_at))
      log(recentMatchesFromVolunteer)
  
      if (user.disponibilidade_de_atendimentos === '5_ou_mais') {
        isAvailable = true
      } else if (Number(user.disponibilidade_de_atendimentos) > user.atendimentos_em_andamento_calculado_) {
        isAvailable = true
      }
    } else {
      log(`User '${ticket.requester_id}' belongs to MSR organization, no need to check availability. Ticket '${ticket.ticket_id}'.`)
      return res.status(200).json('User belonts to MSR organization.')
    }
  } catch (e) {
    log(e)
  }

  if (!isAvailable) {
    log(`User '${ticket.requester_id}' isn't available. Ticket '${ticket.ticket_id}'.`)
    return res.status(200).json('Ok!')
  }

  log(`User '${ticket.requester_id}' available to match! Ticket '${ticket.ticket_id}'.`)

  // Buscar encaminhamentos que aconteceram nos últimos 30 dias
  return res.status(200).json('Ok!')
}

export default App
