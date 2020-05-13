import ZendeskBase from "./ZendeskBase";
import { TicketZendesk } from "../interfaces/Ticket";

interface ResponseTicket {
  ticket: TicketZendesk;
}

/**
 * Returns a ticket by id
 * @param ticket_id Ticket's id
 * @returns ResponseTicket object
 */
const getTicket = (ticket_id: number | string) =>
  ZendeskBase.get<ResponseTicket>(`tickets/${ticket_id}`);

export default getTicket;
