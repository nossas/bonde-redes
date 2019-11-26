interface Obj {
  id: number
}

const handleTicketId = <T extends Obj>(ticket: T) => {
  const { id, ...otherFields } = ticket
  return {
    ticket_id: id,
    ...otherFields,
  }
}

export default handleTicketId
