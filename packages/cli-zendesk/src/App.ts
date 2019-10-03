import sendRequesters from "./sendRequesters"
import getAllTickets from "./getAllTickets"
import getTicketsWithCustomFields from "./getTicketsWithCustomFields"
import countTickets from "./countTickets"
import convertRequestersToArray from "./convertRequestersToArray"
import saveTicketsInChunks from "./saveTicketsInChunks"
import getAllUsers from "./getAllUsers"
import getUsersWithUserFields from "./getUsersWithUserFields"
import saveUsersInChunks from "./saveUsersInChunks"

const ticket = async () => {
  const ticketsWithoutCustomFields = await getAllTickets()
  const tickets = getTicketsWithCustomFields(ticketsWithoutCustomFields)
  const requesters = await countTickets(tickets)
  const requestersArray = convertRequestersToArray(requesters)
  await sendRequesters(requestersArray)
  await saveTicketsInChunks(tickets)
}

const user = async () => {
  const usersWithoutCustomFields = await getAllUsers()
  const users = await getUsersWithUserFields(usersWithoutCustomFields)
  await saveUsersInChunks(users)
}

export default {ticket, user}
