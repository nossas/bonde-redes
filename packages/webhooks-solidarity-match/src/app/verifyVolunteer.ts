import getUserFromTicket, { UserFromTicket } from "../hasura/getUserFromTicket"
import { Ticket } from "../interfaces/Ticket"
import getRecentMatches from "../hasura/getRecentMatches"
import dbg from "./dbg"
import Unpromise from "../interfaces/Unpromisify"

const log = dbg.extend('verifyVolunteer.ts')

export enum VERIFY_VOLUNTEER_STATUS {
  NOT_FOUND,
  STATUS_NOT_AVAILABLE,
  HAVE_NO_MATCHES,
  AVAILABLE,
  NOT_AVAILABLE
}

interface OK {
  status: VERIFY_VOLUNTEER_STATUS.AVAILABLE
  user: Exclude<Unpromise<ReturnType<typeof getUserFromTicket>>, void>[0]
} 
type NOT_OK = {
  status: Exclude<VERIFY_VOLUNTEER_STATUS, VERIFY_VOLUNTEER_STATUS.AVAILABLE>
}

const verifyVolunteer = async ({requester_id, ticket_id}: Ticket, user?: UserFromTicket): Promise<OK | NOT_OK> => {
  if (!user) {
    const users = await getUserFromTicket(requester_id)
    if (!users || users.length !== 1) {
      // log(`User '${requester_id}' not found for ticket '${ticket_id}'.`)
      return {
        status: VERIFY_VOLUNTEER_STATUS.NOT_FOUND
      }
      // return res.status(500).json('User not found.')
    }
  
    user = users[0]
    if (user.condition !== 'disponivel') {
      // log(`User '${requester_id}' doesn't have available status. Ticket '${ticket_id}'.`)
      return {
        status: VERIFY_VOLUNTEER_STATUS.STATUS_NOT_AVAILABLE
      }
      // return res.status(200).json(`Requester isn't available`)
    }
  }

  const matchesFromVolunteer = await getRecentMatches(requester_id)
  if (!matchesFromVolunteer) {
    return {
      status: VERIFY_VOLUNTEER_STATUS.HAVE_NO_MATCHES
    }
  }

  const dateThirtyDaysBefore = new Date(new Date().setDate(new Date().getDate() - 30))
  const recentMatchesFromVolunteer = matchesFromVolunteer.filter(i => dateThirtyDaysBefore < new Date(i.created_at)).length

  log(`Ticket '${ticket_id}', requester '${requester_id}', availability '${user.disponibilidade_de_atendimentos}', in calculated progress '${user.atendimentos_em_andamento_calculado_}', with recent referrals '${user.atendimentos_em_andamento_calculado_ - recentMatchesFromVolunteer}'.`)

  if (
    user.disponibilidade_de_atendimentos === '5_ou_mais' ||
    Number(user.disponibilidade_de_atendimentos) > user.atendimentos_em_andamento_calculado_ + recentMatchesFromVolunteer
  ) {
    return {
      status: VERIFY_VOLUNTEER_STATUS.AVAILABLE,
      user
    }
  }

  return {
    status: VERIFY_VOLUNTEER_STATUS.NOT_AVAILABLE
  }
}

export default verifyVolunteer
