import { saveTicketHasura, checkOldTickets } from "./";
import client from "../../zendesk";
import { handleTicketError } from "../../utils";
import dbg from "../../dbg";

const log = dbg.extend("createZendeskTickets");

const createTicket = ticket => {
  return client.tickets.create({ ticket }, (err, _req, result: any) => {
    if (err) {
      log(err);
      return handleTicketError(ticket);
    }
    // log(
    //   `Results from zendesk ticket creation ${JSON.stringify(result, null, 2)}`
    // );
    log("Zendesk ticket created successfully");
    return saveTicketHasura({
      ...result,
      requester_id: ticket.requester_id
    });
  });
};

export default async (tickets: any) => {
  log(`${new Date()}: \nEntering createZendeskTickets`);
  return tickets.map((ticket, i: number) => {
    setTimeout(() => {
      checkOldTickets(ticket);
      return createTicket(ticket);
    }, i * 2500);
  });
};
