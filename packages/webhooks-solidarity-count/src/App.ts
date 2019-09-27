import getTicket from './zendesk/getTicket'
import { Response } from 'express'
import { Ticket, handleCustomFields } from './interfaces/Ticket'
import saveTicket from './hasura/saveTicket'
import dbg from './dbg'
import getUserRequestedTickets from './zendesk/getUserRequestedTickets'
import updateRequesterFields from './zendesk/updateRequesterFields'
import countTickets from './countTickets'
import verifyOrganization from './verifyOrganizations'
import { ORGANIZATIONS } from './interfaces/Organizations'
import updateHasura from './updateHasura'

const log = dbg.extend('app')

/**
 * @param id ID do ticket
 */
const App = async (id: string, res: Response) => {
  // Busca o ticket no zendesk
  const response = await getTicket(id)
  if (!response) {
    return res.status(500).json(`Não foi possível buscar o ticket com id '${id}'.`)
  }

  // Converte o ticket para conter os custom_fields na raiz
  const {ticket: ticketWithoutCustomValues} = response.data
  const ticket = handleCustomFields(ticketWithoutCustomValues)

  // Salva o ticket no Hasura
  if (!await updateHasura(ticket)) {
    log(`failed to update ticket '${id}' on Hasura`)
    return res.status(500).json('Erro ao salvar ticket no Hasura')
  }

  log(`ticket '${id}' updated on Hasura`)

  // Verifica se o ticket possui link match, e se o requester_id é uma voluntária
  const organization = await verifyOrganization(ticket)
  if (organization === ORGANIZATIONS.MSR) {
    log(`ticket '${id}' alterado pertence à uma MSR, não é necessário recontagem.`)
    return res.status(200).json('Ok!')
  }

  if (organization !== ORGANIZATIONS.ADVOGADA && organization !== ORGANIZATIONS.PSICOLOGA) {
    log(`erro interno no servidor referente ao parse de organizações, ticket '${id}'`)
    return res.status(200).json(`Ok!`)
  }

  const ticketsFromUser = await getUserRequestedTickets(ticket.requester_id)
  if (!ticketsFromUser) {
    log(`não foi possível buscar os tickets do usuário '${ticket.requester_id}'.`)
    return res.status(500).json(`não foi possível buscar os tickets do usuário '${ticket.requester_id}'.`)
  }

  const {data: {tickets}} = ticketsFromUser
  const countTicket = countTickets(tickets)

  const updateRequesterResponse = updateRequesterFields(ticket.requester_id, countTicket)
  if (!updateRequesterResponse) {
    log(`não foi possível atualizar os campos do usuário '${ticket.requester_id}', ticket '${id}'.`)
    return res.status(500).json(`não foi possível atualizar os campos do usuário '${ticket.requester_id}', ticket '${id}'.`)
  }

  log(`contagem do usuário '${ticket.requester_id}' atualizada.`)
  return res.status(200).json('Ok!')
}

export default App
