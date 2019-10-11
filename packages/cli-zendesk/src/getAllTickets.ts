import { Ticket } from './interfaces/Ticket'
import getTicketsByPage from './zendesk/getTicketsByPage'
import dbg from './dbg'

const log = dbg.extend('getAllTickets')

const getAllTickets = async () => {
  const tickets: Ticket[] = []
  let start_time = 1
  let counter = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const actualPageTickets = await getTicketsByPage(start_time)
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 5000))
    if (actualPageTickets) {
      const { data: { count, end_time, tickets: requestedTickets } } = actualPageTickets
      start_time = end_time
      requestedTickets.forEach((i) => tickets.push(i))
      counter += count
      log(`[${counter}], end_time: ${start_time}`)
      if (count < 1000) {
        break
      }
    } else {
      // Posteriormente fazer tratamento para tentar a requisição novamente
    }
  }

  return tickets
}

export default getAllTickets
