import client from "../../zendesk";
import { extractTypeFromSubject } from "../../utils";
import dbg from "../../dbg";

const log = dbg.extend("checkOldTickets");

const updateTicketsStatus = (tickets) => {
  log("Entering updateTicketsStatus");
  return tickets.map((ticket, i: number) => {
    const changeStatus = {
      ticket: {
        status: "closed" as "closed",
        comment: {
          body: "Fechado após MSR fazer um novo pedido de acolhimento identico",
          public: false,
        },
      },
    };
    return setTimeout(() => {
      return client.tickets.update(
        ticket.id,
        changeStatus,
        (err, _req, result) => {
          if (err && !result) {
            log(
              `Failed to update ticket status to closed, this is the ticket id '${ticket.id}'`
            );
            log(err);
            return undefined;
          }
          log(
            `${new Date()}: Ticket '${
              ticket.id
            }' status was susccessfully altered to closed`
          );
        }
      );
    }, i * 2500);
  });
};

export default async ({ requester_id, subject }) => {
  return client.tickets.listByUserRequested(
    requester_id,
    (err, _req, result: any) => {
      if (err) {
        log(`Failed to fetch tickets from user '${requester_id}'`);
        log(err);
        return undefined;
      }
      // Tickets com status novo e mesmo pedido de acolhimento
      // são esses que não  devem ser gerados novamente
      const newSubject = extractTypeFromSubject(subject);
      const closeTickets = result.filter((oldTicket) => {
        const oldSubject = extractTypeFromSubject(oldTicket.subject);
        return oldSubject === newSubject && oldTicket.status === "new";
      });
      if (closeTickets.length > 0) return updateTicketsStatus(closeTickets);
      return false;
    }
  );
};
