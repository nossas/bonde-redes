import { Ticket } from "./interfaces/Ticket"
import dbg from "./dbg"
import saveTickets from "./hasura/saveTickets"
import R from 'ramda'

const log = dbg.extend('saveTicketsInChunks')

const saveTicketsInChunks = async (users: Ticket[]) => {
  const splitedTickets = R.splitEvery(1000, users) as Ticket[][]
  let contador = 0
  for await (const ticketsChunk of splitedTickets) {
    await saveTickets(ticketsChunk)
    contador += ticketsChunk.length
    log(`[${contador}/${users.length}]`)
  }
}

export default saveTicketsInChunks
