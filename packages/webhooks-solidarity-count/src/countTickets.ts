import { TicketZendesk, customFields } from './interfaces/Ticket'

const countTickets = (tickets: Array<TicketZendesk & customFields>) => {
  const userCount = {
    atendimentos_em_andamento_calculado_: 0,
    atendimentos_concludos_calculado_: 0,
    encaminhamentos_realizados_calculado_: 0,
  }

  tickets.forEach((i) => {
    if (i.status_acolhimento === 'atendimento__iniciado') {
      userCount.atendimentos_em_andamento_calculado_ += 1
    } else if (i.status_acolhimento === 'atendimento__concluído') {
      userCount.atendimentos_concludos_calculado_ += 1
    } else if (i.status_acolhimento === 'encaminhamento__realizado' || i.status_acolhimento === 'encaminhamento__realizado_para_serviço_público') {
      userCount.encaminhamentos_realizados_calculado_ += 1
    }
  })

  return userCount
}

export default countTickets
