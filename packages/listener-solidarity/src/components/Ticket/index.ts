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

export const dicio: {
  360014379412: "status_acolhimento";
  360016631592: "nome_voluntaria";
  360016631632: "link_match";
  360016681971: "nome_msr";
  360017056851: "data_inscricao_bonde";
  360017432652: "data_encaminhamento";
  360021665652: "status_inscricao";
  360021812712: "telefone";
  360021879791: "estado";
  360021879811: "cidade";
} = {
  360014379412: "status_acolhimento",
  360016631592: "nome_voluntaria",
  360016631632: "link_match",
  360016681971: "nome_msr",
  360017056851: "data_inscricao_bonde",
  360017432652: "data_encaminhamento",
  360021665652: "status_inscricao",
  360021812712: "telefone",
  360021879791: "estado",
  360021879811: "cidade",
};

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
      const custom_fields = result.custom_fields.reduce(
        (newObj, old) => ({
          ...newObj,
          [dicio[old.id]]: old.value,
        }),
        {}
      );
      saveTicketHasura({
        ...result,
        ...custom_fields,
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
          custom_fields: [
            {
              id: 360014379412,
              value: "solicitação_repetida",
            },
          ],
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
