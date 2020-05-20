import R from "ramda";
import { Ticket } from "./interfaces/Ticket";
import { Match } from "./interfaces/Match";
import verifyOrganization from "./verifyOrganizations";
import { ORGANIZATIONS } from "./interfaces/Organizations";
import dbg from "./dbg";
import saveMatches from "./hasura/saveMatches";

const log = dbg.extend("saveMatches");

const countMatches = async (tickets: Ticket[]) => {
  // Recebe lista de tickets, pareia os matches objeto do tipo id -> id, e salva no banco do hasura
  const matchList: Map<number, number> = new Map();
  const ticketsById: {
    [s: number]: Ticket;
  } = {};
  tickets.forEach(i => {
    ticketsById[i.ticket_id] = i;
    if (i.link_match) {
      const matchId = Number(i.link_match.split("/").slice(-1)[0]);
      if (Number.isNaN(matchId)) {
        return log(
          `failed to convert '${i.link_match}' for ticket '${i.ticket_id}'`
        );
      }
      if (i.ticket_id === matchId) {
        return log(
          `you can't match a ticket with itself. Ticket '${i.ticket_id}'`
        );
      }
      matchList.set(i.ticket_id, matchId);
    }

    return undefined;
  });

  const matches: Map<number, Match> = new Map();

  for await (const [id1, id2] of matchList.entries()) {
    let volunteer_ticket: Ticket;
    let individuals_ticket: Ticket;
    const organization = await verifyOrganization(ticketsById[id1]);
    if (organization === undefined) {
      return false;
    }

    if (organization === ORGANIZATIONS.MSR) {
      individuals_ticket = ticketsById[id1];
      volunteer_ticket = ticketsById[id2];
    } else {
      individuals_ticket = ticketsById[id2];
      volunteer_ticket = ticketsById[id1];
    }

    const { COMMUNITY_ID } = process.env;

    matches.set(individuals_ticket.ticket_id, {
      individuals_ticket_id: individuals_ticket.ticket_id,
      individuals_user_id: individuals_ticket.requester_id,
      volunteers_ticket_id: volunteer_ticket.ticket_id,
      volunteers_user_id: volunteer_ticket.requester_id,
      created_at: volunteer_ticket.created_at,
      status: individuals_ticket.status_acolhimento,
      community_id: Number(COMMUNITY_ID)
    });
  }

  const array = Array.from(matches.values());
  const splittedArray = R.splitEvery(1000, array) as Match[][];
  let counter = 0;
  for await (const i of splittedArray) {
    counter += i.length;
    log(`[${counter}/${array.length}]`);
    await saveMatches(i);
  }

  return undefined;
};

export default countMatches;
