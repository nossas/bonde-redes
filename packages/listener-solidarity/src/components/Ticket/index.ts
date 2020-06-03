import { createZendeskTickets, composeTickets } from "./";
import dbg from "../../dbg";

const log = dbg.extend("Tickets");

export default async (users) => {
  const tickets = await composeTickets(users);
  // log(JSON.stringify(tickets, null, 2));
  return createZendeskTickets(tickets);
};

export { default as createZendeskTickets } from "./createZendeskTickets";
export { default as checkOldTickets } from "./checkOldTickets";
export { default as saveTicketHasura } from "./saveTicketHasura";
export { default as composeTickets } from "./composeTickets";
