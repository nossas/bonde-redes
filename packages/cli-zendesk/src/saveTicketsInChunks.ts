import { Ticket } from "./interfaces/Ticket"
import dbg from "./dbg"
import saveTickets from "./hasura/saveTickets"

const log = dbg.extend('saveTicketsInChunks')

const saveTicketsInChunks = async (tickets: Ticket[]) => {
  let offset = 0
  const limit = 1000
  while (true) {
    log(`[${offset+limit > tickets.length ? tickets.length : offset+limit}/${tickets.length}]`)
    await saveTickets(tickets.slice(offset, offset + limit))
    await new Promise(r => setTimeout(r, 1000))
    if (offset + limit >= tickets.length) {
      break
    }
    offset += limit
  }
}

export default saveTicketsInChunks
