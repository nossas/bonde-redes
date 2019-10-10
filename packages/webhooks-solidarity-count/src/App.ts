import getTicket from './zendesk/getTicket'
import { Response } from 'express'
import { handleCustomFields } from './interfaces/Ticket'
import dbg from './dbg'
import getUserRequestedTickets from './zendesk/getUserRequestedTickets'
import updateRequesterFields from './zendesk/updateRequesterFields'
import countTickets from './countTickets'
import verifyOrganization from './verifyOrganizations'
import { ORGANIZATIONS } from './interfaces/Organizations'
import updateHasura from './updateHasura'
import updateUserTicketCount from './hasura/updateUserTicketCount'
import getUser from './zendesk/getUser'
import saveUsers from './hasura/saveUsers'
import { handleUserFields } from './interfaces/User'

const log = dbg.extend('app')

/**
 * @param id ID do ticket
 */
const App = async (id: string, res: Response) => {
  // Busca o ticket no zendesk
  const response = await getTicket(id)
  if (!response) {
    return res.status(500).json(`Can't find ticket '${id}'.`)
  }

  // Converte o ticket para conter os custom_fields na raiz
  const {ticket: ticketWithoutCustomValues} = response.data
  const ticket = handleCustomFields(ticketWithoutCustomValues)

  // Salva o ticket no Hasura
  if (!await updateHasura(ticket)) {
    log(`Failed to update ticket '${id}' on Hasura.`)
    return res.status(500).json('Failed to save ticket on Hasura.')
  }

  log(`Ticket '${id}' updated on Hasura.`)

  // Busca o usuário no zendesk
  const getUserResponse = await getUser(ticket.requester_id)
  if (!getUserResponse) {
    log(`Failed to get user '${ticket.requester_id}'.`)
    return res.status(500).json(`Failed to get user.`)
  }

  const userWithUserFields = handleUserFields(getUserResponse.data.user)

  // Salva o usuário no Hasura
  const saveUserResponse = await saveUsers([userWithUserFields])
  if (saveUserResponse !== true) {
    log(`Failed to save user '${ticket.requester_id}'. Ticket ${ticket.ticket_id}.`)
    return res.status(500).json(`Failed to save user.`)
  }

  // Verifica se o ticket possui link match, e se o requester_id é uma voluntária
  const organization = await verifyOrganization(ticket)
  if (organization === ORGANIZATIONS.MSR) {
    log(`Updated ticket '${id}' belongs to MSR organization, recount tickets isn't necessary.`)
    return res.status(200).json('Ok!')
  }

  if (organization !== ORGANIZATIONS.ADVOGADA && organization !== ORGANIZATIONS.PSICOLOGA) {
    log(`Internal server error relative to organization parse, ticket '${id}'.`)
    return res.status(200).json(`Ok!`)
  }

  // Busca todos os tickets do requester_id
  const ticketsFromUser = await getUserRequestedTickets(ticket.requester_id)
  if (!ticketsFromUser) {
    log(`Can't find tickets for user '${ticket.requester_id}', ticket '${id}'.`)
    return res.status(500).json(`Can't find tickets.`)
  }

  // Conta os tickets
  const {data: {tickets}} = ticketsFromUser
  const countTicket = countTickets(tickets)

  const updateRequesterZendeskResponse = await updateRequesterFields(ticket.requester_id, countTicket)
  if (!updateRequesterZendeskResponse) {
    log(`Can't update user fields for user '${ticket.requester_id}', ticket '${id}'.`)
    return res.status(500).json(`Can't update user fields.`)
  }

  const saveUsersHasuraResponse = await updateUserTicketCount([{
    user_id: ticket.requester_id,
    ...countTicket
  }])

  if (saveUsersHasuraResponse !== true) {
    log(`Failed to update user '${ticket.requester_id}'.`)
    return res.status(500).json('Failed to update user.')
  }

  log(`User '${ticket.requester_id}' count updated, ticket '${id}'.`)
  return res.status(200).json('Ok!')
}

export default App
