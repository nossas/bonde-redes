import { extractTypeFromSubject } from "../../utils";
import { Ticket } from "../../types";
import dbg from "../../dbg";

const log = dbg.extend("checkOldTickets");

export default async (subject: string, tickets: Ticket[]) => {
  log("Checking old tickets");
  const newSubject = extractTypeFromSubject(subject);
  const hasSameSubject = tickets.filter((oldTicket) => {
    const oldSubject = extractTypeFromSubject(oldTicket.subject);
    return oldSubject === newSubject;
  });

  if (hasSameSubject.length < 1) return undefined;

  const hasNewTickets = hasSameSubject.filter(
    (oldTicket) => oldTicket.status === "new"
  );
  if (hasNewTickets.length > 0) return hasNewTickets;

  const hasMatch = hasSameSubject.filter(
    (oldTicket) => oldTicket.status === "open" || oldTicket.status === "pending"
  );
  if (hasMatch.length > 0) return "hasMatch";

  return undefined;
};
