import { Ticket } from "./interfaces/Ticket";
import getTicketsByPage from "./zendesk/getTicketsByPage";
import dbg from "./dbg";

const log = dbg.extend('getAllTickets')

const getAllTickets = async () => {
  let tickets: Ticket[] = [];
  let actualPageNumber = 1
  while (true) {
    const actualPageTickets = await getTicketsByPage(actualPageNumber)
    if (actualPageTickets) {
      tickets = [...tickets, ...actualPageTickets.data.tickets]
      if (actualPageTickets.data.next_page) {
        log(`[${Number(actualPageNumber) * 100}/${actualPageTickets.data.count}]`)
        actualPageNumber = actualPageNumber + 1
      } else {
        log(`[${Number(actualPageTickets && actualPageTickets.data.count)}/${actualPageTickets && actualPageTickets.data.count}]`)
        break
      }
    } else {
      // Posteriormente fazer tratamento para tentar a requisição novamente
    }
  }

  return tickets
}

export default getAllTickets
