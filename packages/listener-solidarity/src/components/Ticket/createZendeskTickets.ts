import { saveTicketHasura, checkOldTickets } from "./";
import client from "../../zendesk";
import { handleTicketError } from "../../utils";
import { Ticket } from "../../types";
import dbg from "../../dbg";
import closeTickets from "./closeTickets";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

const createTicketLog = dbg.extend("createTicket");
const listUserTicketsLog = dbg.extend("listUserTickets");
const log = dbg.extend("createZendeskTickets");

const createTicket = (ticket) => {
  createTicketLog(`${new Date()}: CREATE TICKET`);
  return new Promise((resolve) => {
    return client.tickets.create({ ticket }, (err, _req, result: any) => {
      if (err) {
        createTicketLog(err);
        resolve(true);
        return handleTicketError(ticket);
      }
      // createTicketLog(
      //   `Results from zendesk ticket creation ${JSON.stringify(
      //     result,
      //     null,
      //     2
      //   )}`
      // );
      createTicketLog("Zendesk ticket created successfully!");
      resolve(true);
      return saveTicketHasura({
        ...result,
        requester_id: ticket.requester_id,
      });
    });
  });
};

const listUserTickets = async ({
  requester_id,
}): Promise<Ticket[] | undefined> => {
  listUserTicketsLog(`${new Date()}: LIST USER TICKETS`);
  return new Promise((resolve) => {
    return client.tickets.listByUserRequested(
      requester_id,
      (err, _req, result: any) => {
        if (err) {
          listUserTicketsLog(
            `Failed to fetch tickets from user '${requester_id}'`
          );
          listUserTicketsLog(err);
          return resolve(undefined);
        }
        resolve(result);
      }
    );
  });
};

export default async (tickets: Ticket[]) => {
  log(`${new Date()}: Entering createZendeskTickets`);
  return tickets.map(async (ticket) => {
    const userTickets = await limiter.schedule(() => listUserTickets(ticket));
    if (!userTickets) return handleTicketError(ticket);

    const oldTickets = await checkOldTickets(ticket.subject, userTickets);

    if (oldTickets === "hasMatch") {
      return await limiter.schedule(() =>
        createTicket({
          ...ticket,
          status: "closed",
          comment: {
            body:
              "Ticket foi criado com status fechado pois MSR já possui um atendimento em andamento com o mesmo tipo de pedido de acolhimento",
            public: false,
          },
        })
      );
    }

    if (oldTickets && oldTickets.length > 0) {
      await limiter.schedule(() => closeTickets(oldTickets));
    }

    return await limiter.schedule(() => createTicket(ticket));
  });
};
