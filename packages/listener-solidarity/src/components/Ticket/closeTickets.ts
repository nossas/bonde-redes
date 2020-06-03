import client from "../../zendesk";
import dbg from "../../dbg";
import { Ticket } from "../../types";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

const log = dbg.extend("closeTickets");

// const userTickets = await limiter.schedule(() => listUserTickets(ticket));

export default (tickets: Ticket[]) => {
  log("Entering closeTickets");
  const updateTickets = tickets.map(async (ticket, i: number) => {
    const changeStatus = {
      ticket: {
        status: "closed" as "closed",
        comment: {
          body: "Fechado após MSR fazer um novo pedido de acolhimento identico",
          public: false,
        },
      },
    };
    return await limiter.schedule(() => {
      return new Promise((resolve) => {
        return client.tickets.update(
          ticket.id,
          changeStatus,
          (err, _req, result) => {
            if (err && !result) {
              log(
                `Failed to update ticket status to closed, this is the ticket id: '${ticket.id}'`
                  .red,
                err
              );
              return resolve(undefined);
            }
            log(
              `${new Date()}: Ticket '${
                ticket.id
              }' status was susccessfully altered to closed`
            );
            return resolve(true);
          }
        );
      });
    });
  });
  return Promise.all(updateTickets);
};
