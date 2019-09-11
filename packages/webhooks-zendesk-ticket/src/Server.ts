import Express from 'express'
import debug, { Debugger } from 'debug'
import ListTickets from './integrations/ListTickets';
import saveTickets from './integrations/SaveTickets';

export const dicio: {
  360014379412: 'status_acolhimento'
  360016631592: 'nome_voluntaria'
  360016631632: 'link_match'
  360016681971: 'nome_msr'
  360017056851: 'data_inscricao_bonde'
  360017432652: 'data_encaminhamento'
  360021665652: 'status_inscricao'
  360021812712: 'telefone'
  360021879791: 'estado'
  360021879811: 'cidade'
} = {
  360014379412: 'status_acolhimento',
  360016631592: 'nome_voluntaria',
  360016631632: 'link_match',
  360016681971: 'nome_msr',
  360017056851: 'data_inscricao_bonde',
  360017432652: 'data_encaminhamento',
  360021665652: 'status_inscricao',
  360021812712: 'telefone',
  360021879791: 'estado',
  360021879811: 'cidade'
}

export interface Ticket {
  id: number
  assignee_id: number
  created_at: string
  custom_fields: {
    id: keyof typeof dicio
    value: string | null
  }[]
  description: string
  group_id: number
  organization_id: number
  raw_subject: string
  requester_id: number
  status: string
  subject: string
  submitter_id: number
  tags: string[]
  updated_at: string
  status_acolhimento: string | null
  nome_voluntaria: string | null
  link_match: string | null
  nome_msr: string | null
  data_inscricao_bonde: string | null
  data_encaminhamento: string | null
  status_inscricao: string | null
  telefone: string | null
  estado: string | null
  cidade: string | null
  community_id: number
}

const handleCustomFields = (ticket: Ticket) => {
  ticket.custom_fields.forEach(i => {
    if (dicio[i.id]) {
      ticket[dicio[i.id]] = i.value
    }
  })

  return ticket
}

class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  private formData?: FormData

  constructor () {
    this.dbg = debug(`webhooks-zendesk-ticket`)
  }

  saveTicket = async (ticket: Ticket) => {
    try {
      await saveTickets(ticket)
    } catch (e) {
      console.log('Falhou para o ticket ' + ticket.id)
      console.log('Tentando novamente em 1 segundo...')
      await new Promise(r => setTimeout(r, 1000))
      this.saveTicket(ticket)
    }
  }

  start = async () => {
    let tickets: Ticket[] = [];
    let actualPageNumber = '1'
    while (true) {
      const listTickets = new ListTickets()
      const actualPageTickets = await listTickets.start(actualPageNumber)
      if (actualPageTickets) {
        tickets = [...tickets, ...actualPageTickets.data.tickets]
        if (actualPageTickets.data.next_page) {
          console.log(`[${Number(actualPageNumber)*100}/${actualPageTickets.data.count}]`)
          actualPageNumber = (~~actualPageNumber + 1).toString()
        } else {
          console.log(`[${Number(actualPageTickets && actualPageTickets.data.count)}/${actualPageTickets && actualPageTickets.data.count}]`)
          break
        }
      } else {
        // Posteriormente fazer tratamento para tentar a requisição novamente
      }
    }

    const { COMMUNITY_ID } = process.env
    await Promise.all(tickets.map(async i => {
      const ticketWithCustomFields = {
        ...handleCustomFields(i),
        community_id: Number(COMMUNITY_ID)
      }
      return this.saveTicket(ticketWithCustomFields)
    }))

    console.log('Script finalizado!')
  }
}

export default Server
