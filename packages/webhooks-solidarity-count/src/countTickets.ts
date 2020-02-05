import { TicketZendesk, customFields } from './interfaces/Ticket'

const countTickets = (tickets: Array<TicketZendesk & customFields>) => {
  let userCount = {
    atendimentos_em_andamento_calculado_: 0,
    atendimentos_concludos_calculado_: 0,
    encaminhamentos_realizados_calculado_: 0,
  }


  tickets.map((i) => {
    if (i.status === 'pending') {
      switch (i.status_acolhimento) {
        case 'atendimento__iniciado':
          return userCount.atendimentos_em_andamento_calculado_ += 1
        case 'atendimento__concluído':
          return userCount.atendimentos_concludos_calculado_ += 1
        case 'encaminhamento__realizado':
          return userCount.encaminhamentos_realizados_calculado_ += 1
      }
    }
  })

  return userCount
}

export default countTickets
