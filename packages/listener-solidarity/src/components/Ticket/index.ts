import { checkOldTickets } from "./";
import client from "../../zendesk";
import { insertSolidarityTickets } from "../../graphql/mutations";
import { handleTicketError } from "../../utils";
import { Ticket, CustomFields } from "../../types";
import dbg from "../../dbg";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 2000,
});

const createTicketLog = dbg.extend("createTicket");
const fetchUserTicketsLog = dbg.extend("fetchUserTickets");
const log = dbg.extend("createZendeskTickets");

const dicio = {
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
  360032229831: "atrelado_ao_ticket",
};

const saveTicketInHasura = async (ticket: Ticket) => {
  createTicketLog("Preparing ticket to be saved in Hasura");
  const custom_fields: CustomFields = ticket.custom_fields.reduce(
    (newObj, old) => {
      const key = dicio[old.id] && dicio[old.id];
      return {
        ...newObj,
        [key]: old.value,
      };
    },
    {}
  );
  // log({ hasuraTicket: JSON.stringify(hasuraTicket, null, 2) });
  const inserted = await insertSolidarityTickets({
    ...ticket,
    ...custom_fields,
    ticket_id: ticket.id,
    community_id: Number(process.env.COMMUNITY_ID),
  });
  if (!inserted) return handleTicketError(ticket);
  return createTicketLog("Ticket integration is done.");
};

const createTicket = (ticket): Promise<boolean | undefined> => {
  createTicketLog(`${new Date()}: CREATE TICKET`);
  return new Promise((resolve) => {
    return client.tickets.create({ ticket }, (err, _req, result: any) => {
      if (err) {
        createTicketLog(
          `Failed to create ticket for user '${ticket.requester_id}'`.red,
          err
        );
        return resolve(undefined);
      }
      // createTicketLog(
      //   `Results from zendesk ticket creation ${JSON.stringify(
      //     result,
      //     null,
      //     2
      //   )}`
      // );
      createTicketLog("Zendesk ticket created successfully!");
      saveTicketInHasura(result);
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

    const relatableTickets = checkOldTickets(ticket.subject, userTickets);

    if (relatableTickets) {
      return await limiter.schedule(() =>
        createTicket({
          ...ticket,
          status: "pending",
          custom_fields: [
            ...ticket.custom_fields,
            {
              id: 360014379412,
              value: "solicitação_repetida",
            },
            {
              id: 360032229831,
              value:
                typeof relatableTickets === "number" ? relatableTickets : null,
            },
          ],
          comment: {
            body: `MSR já possui uma solicitação com o mesmo tipo de pedido de acolhimento nos seguintes tickets: ${
              typeof relatableTickets === "number"
                ? relatableTickets
                : relatableTickets.join(", ")
            }`,
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
export { default as composeTickets } from "./composeTickets";
