import Base from "./Base"
import { Ticket } from "../interfaces/Ticket"

interface ResponseTickets {
  tickets: Ticket[]
}

/**
 * Returns all requested tickets from requester
 * @param requester_id Requester's id
 * @returns ResponseTickets object
 */
const getUserRequestedTickets = (requester_id: number | string) => {
  return Base.get<ResponseTickets>(`users/${requester_id}/tickets/requested`)
}

export default getUserRequestedTickets
