import { Ticket } from "./cli";
import updateTicketRelation from "./updateTicketRelation";
// import updateTicketRelation from "./updateTicketRelation";

export interface TicketIds {
  [s: number]: Ticket
}

export interface Requester {
  id: number
  atendimentos_em_andamento_calculado_: number
  atendimentos_concludos_calculado_: number
  encaminhamentos_realizados_calculado_: number
}

export interface Requesters {
  [s: number]: Requester
}

const countTickets = async (tickets: Ticket[], ticketsByTicketId: TicketIds) => {
  const requesters: Requesters = {}
  const promises = tickets.map(async i => {
    let type: 'voluntaria' | 'msr' | null = null
    if (!i.link_match) {
      return
    }

    if (i.nome_msr) {
      type = 'msr'
    } else if (i.nome_voluntaria) {
      type = 'voluntaria'
    } else if (i.nome_msr && i.nome_voluntaria) {
      type = null
    } else {
      type = null
    }

    if (type === 'msr') {
      // Cria um pivô e inicializa o valor
      let requester_pivot = requesters[i.requester_id]
      if (!requesters[i.requester_id]) {
        requesters[i.requester_id] = {
          id: i.requester_id,
          atendimentos_em_andamento_calculado_: 0,
          atendimentos_concludos_calculado_: 0,
          encaminhamentos_realizados_calculado_: 0
        }
        requester_pivot = requesters[i.requester_id]
      }

      // Atualiza os atendimentos em andamento:
      if (i.status_acolhimento === 'atendimento__iniciado') {
        requester_pivot.atendimentos_em_andamento_calculado_ = requester_pivot.atendimentos_em_andamento_calculado_ + 1
      } else if (i.status_acolhimento === 'atendimento__concluído') {
        requester_pivot.atendimentos_concludos_calculado_ = requester_pivot.atendimentos_concludos_calculado_ + 1
      } else if (i.status_acolhimento === 'encaminhamento__realizado' || i.status_acolhimento === 'encaminhamento__realizado_para_serviço_público') {
        requester_pivot.encaminhamentos_realizados_calculado_ = requester_pivot.encaminhamentos_realizados_calculado_ + 1
      }
    }

    // const { id } = ticketId
    // const { id: webhooks_registry_id } = i

    // await updateTicketRelation(id, webhooks_registry_id)
  })

  await Promise.all(promises)
  return requesters
}

export default countTickets