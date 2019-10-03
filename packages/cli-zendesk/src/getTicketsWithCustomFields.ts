import { Ticket, handleCustomFields } from "./interfaces/Ticket"

const getTicketsWithCustomFields = (tickets: Ticket[]) => {
  const ticketsWithCustomFields = tickets.map(i => handleCustomFields(i))

  return ticketsWithCustomFields
}

export default getTicketsWithCustomFields
