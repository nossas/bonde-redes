import ZendeskBase from "./ZendeskBase";
import { TicketZendesk } from "../interfaces/Ticket";

interface ResponseTickets {
  tickets: TicketZendesk[];
}

/**
 * Returns all requested tickets from requester
 * @param requester_id Requester's id
 * @returns ResponseTickets object
 */
const getUserRequestedTickets = (requester_id: number | string) =>
  ZendeskBase.get<ResponseTickets>(`users/${requester_id}/tickets/requested`);

export default getUserRequestedTickets;
