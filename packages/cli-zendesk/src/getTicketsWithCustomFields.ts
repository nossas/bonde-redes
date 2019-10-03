import { Ticket, handleCustomFields } from "./interfaces/Ticket"

const getTicketsWithCustomFields = (tickets: Ticket[]) => {
  // Convert tickets to have custom_fields on root:
  const { COMMUNITY_ID } = process.env
  const ticketsWithCustomFields = tickets.map(i => {
    const {id, ...otherProperties} = i
    return {
      ticket_id: id,
      ...otherProperties,
      ...handleCustomFields(i),
      community_id: Number(COMMUNITY_ID)
    }
  })

  return ticketsWithCustomFields
}

export default getTicketsWithCustomFields
