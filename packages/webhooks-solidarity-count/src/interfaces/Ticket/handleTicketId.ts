const handleTicketId = ticket => {
  const { id, ...otherFields } = ticket;
  return {
    ticket_id: id,
    ...otherFields
  };
};

export default handleTicketId;
