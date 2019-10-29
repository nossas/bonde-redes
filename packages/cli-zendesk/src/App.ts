// import fs from 'fs'
// import { promisify } from 'util'
import sendRequesters from './sendRequesters'
import getAllTickets from './getAllTickets'
import getTicketsWithCustomFields from './getTicketsWithCustomFields'
import countTickets from './countTickets'
import convertRequestersToArray from './convertRequestersToArray'
import saveTicketsInChunks from './saveTicketsInChunks'
import getAllUsers from './getAllUsers'
import getUsersWithUserFields from './getUsersWithUserFields'
import saveUsersInChunks from './saveUsersInChunks'
import countMatches from './countMatches'
import getFormEntries, { filterByEmail } from './hasura/getFormEntries'
// import { Ticket } from './interfaces/Ticket'
// import User from './interfaces/User'

const ticket = async () => {
  // const tickets = JSON.parse(((await promisify(fs.readFile)('tickets.json')).toString())) as Ticket[]
  const ticketsWithoutCustomFields = await getAllTickets()
  const tickets = getTicketsWithCustomFields(ticketsWithoutCustomFields)
  // await promisify(fs.writeFile)('tickets.json', JSON.stringify(tickets))
  const requesters = await countTickets(tickets)
  const requestersArray = convertRequestersToArray(requesters)
  await sendRequesters(requestersArray)
  await saveTicketsInChunks(tickets)
  await countMatches(tickets)
}

const user = async () => {
  // const users = JSON.parse(((await promisify(fs.readFile)('users.json')).toString())) as User[]
  const usersWithoutCustomFields = await getAllUsers()
  const users = await getUsersWithUserFields(usersWithoutCustomFields)
  // await promisify(fs.writeFile)('users.json', JSON.stringify(users))
  const formEntries = await getFormEntries()
  const usersWithBondeDate = users.map((i) => ({
    ...i,
    data_de_inscricao_no_bonde: filterByEmail(formEntries, i.email),
  }))
  await saveUsersInChunks(usersWithBondeDate)
}

export default { ticket, user }
