import { Ticket } from "./cli";
import updateTicketRelation from "./updateTicketRelation";
// import updateTicketRelation from "./updateTicketRelation";

export interface TicketIds {
  [s: number]: Ticket
}

interface Requester {
  atendimentos_em_andamento: number
  atendimento__concluído: number
  encaminhamentos: number
}

interface Requesters {
  [s: number]: Requester
}

const countTickets = async (tickets: Ticket[], ticketIds: TicketIds) => {
  const requesters: Requesters = {}
  const promises = tickets.map(async i => {
    let type: 'voluntaria' | 'msr' | null = null
    if (!i.link_match) {
      console.log('Não tem link match', i)
      return
    }

    let matchId: number
    try {
      matchId = Number(i.link_match.split('/').slice(-1)[0])
    } catch (e) {
      console.log('Falhou ao gerar o link do match!', i.id)
      return
    }

    if (isNaN(matchId)) {
      console.log('É NaN', i.id)
      return
    }

    const ticketId = ticketIds[matchId]
    if (!ticketId) {
      console.log('Ticket match parece que não existe! :(', matchId)
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
      let requester_pivot = requesters[ticketId.requester_id]
      if (!requesters[ticketId.requester_id]) {
        requesters[ticketId.requester_id] = {
          atendimentos_em_andamento: 0,
          atendimento__concluído: 0,
          encaminhamentos: 0
        }
        requester_pivot = requesters[ticketId.requester_id]
      }

      // Atualiza os atendimentos em andamento:
      if (i.status_acolhimento === 'atendimento__iniciado') {
        requester_pivot.atendimentos_em_andamento = requester_pivot.atendimentos_em_andamento + 1
      } else if (i.status_acolhimento === 'atendimento__concluído') {
        requester_pivot.atendimento__concluído = requester_pivot.atendimento__concluído + 1
      } else if (i.status_acolhimento === 'encaminhamento__realizado' || i.status_acolhimento === 'encaminhamento__realizado_para_serviço_público') {
        requester_pivot.encaminhamentos = requester_pivot.encaminhamentos + 1
      }
    }

    // const { id } = ticketId
    // const { id: webhooks_registry_id } = i

    // await updateTicketRelation(id, webhooks_registry_id)
  })

  await Promise.all(promises)
}

export default countTickets
