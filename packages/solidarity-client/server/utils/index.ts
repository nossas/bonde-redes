export const getUserFromTicket = (users, ticket) => users.filter(user => user.user_id === ticket.requester_id) 

// is welcoming ticket and ticket has user (according to user hasura query)
export const isValidTicket = (users, ticket) => {
  return getSupportType(ticket.subject).length > 0 &&
  getUserFromTicket(users, ticket).length > 0
}

export const getSupportType = subject => {
  const str = subject.toLowerCase()
  const removeSpecialCaracters = str.replace(/[^\w\s]/ig, '')
  // retorna se no subject existe algum match dos termos 
  const match = removeSpecialCaracters.match(/\b(psicolgico|jurdico|psicloga|advogada)\b/g) 
  return match && match.length > 0 ? match : []
}