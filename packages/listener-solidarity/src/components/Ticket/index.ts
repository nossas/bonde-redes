import { saveTicketHasura, checkOldTickets } from "./";
import client from "../../zendesk";
import { handleTicketError } from "../../utils";
import { Ticket } from "../../types";
import dbg from "../../dbg";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

const createTicketLog = dbg.extend("createTicket");
const fetchUserTicketsLog = dbg.extend("fetchUserTickets");
const log = dbg.extend("createZendeskTickets");

const createTicket = (ticket): Promise<boolean | undefined> => {
  createTicketLog(`${new Date()}: CREATE TICKET`);
  return new Promise((resolve) => {
    return client.tickets.create({ ticket }, (err, _req, result: any) => {
      if (err) {
        createTicketLog(err);
        return resolve(handleTicketError(ticket));
      }
      // createTicketLog(
      //   `Results from zendesk ticket creation ${JSON.stringify(
      //     result,
      //     null,
      //     2
      //   )}`
      // );
      createTicketLog("Zendesk ticket created successfully!");
      saveTicketHasura({
        ...result,
        requester_id: ticket.requester_id,
      });
      return resolve(true);
    });
  });
};

export const fetchUserTickets = async ({
  requester_id,
}): Promise<Ticket[] | undefined> => {
  fetchUserTicketsLog(`${new Date()}: LIST USER TICKETS`);
  return new Promise((resolve) => {
    return client.tickets.listByUserRequested(
      requester_id,
      (err, _req, result: any) => {
        if (err) {
          fetchUserTicketsLog(
            `Failed to fetch tickets from user '${requester_id}'`.red,
            err
          );
          return resolve(undefined);
        }
        // fetchUserTicketsLog(JSON.stringify(result, null, 2));
        return resolve(result);
      }
    );
  });
};

export default async (tickets: Ticket[]) => {
  log(`${new Date()}: Entering createZendeskTickets`);
  const createTickets = tickets.map(async (ticket) => {
    const userTickets = await limiter.schedule(() => fetchUserTickets(ticket));
    if (!userTickets) return handleTicketError(ticket);

    const oldTickets = checkOldTickets(ticket.subject, userTickets);

    if (oldTickets) {
      return await limiter.schedule(() =>
        createTicket({
          ...ticket,
          status: "closed",
          comment: {
            body:
              "Ticket foi criado com status fechado pois MSR já possui um encaminhamento feito com o mesmo tipo de pedido de acolhimento",
            public: false,
          },
        })
      );
    }

    return await limiter.schedule(() => createTicket(ticket));
  });
  return Promise.all(createTickets);
};

export { default as checkOldTickets } from "./checkOldTickets";
export { default as saveTicketHasura } from "./saveTicketHasura";
export { default as composeTickets } from "./composeTickets";
