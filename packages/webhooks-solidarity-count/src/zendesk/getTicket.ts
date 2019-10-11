import Base from './Base'
import { Ticket } from '../interfaces/Ticket'

interface ResponseTicket {
  ticket: Ticket
}

/**
 * Returns a ticket by id
 * @param ticket_id Ticket's id
 * @returns ResponseTicket object
 */
const getTicket = (ticket_id: number | string) => Base.get<ResponseTicket>(`tickets/${ticket_id}`)

export default getTicket
