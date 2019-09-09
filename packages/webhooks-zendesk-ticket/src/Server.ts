import Express from 'express'
import debug, { Debugger } from 'debug'
import ListTickets from './integrations/ListTickets';
import saveTickets from './integrations/SaveTickets';

export interface Ticket {
  id: number
  assignee_id: number
  created_at: string
  custom_fields: {
    id: number
    value?: string
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
}

interface TicketResponse {
  tickets: Ticket[]
  next_page: string
}

class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  private formData?: FormData

  constructor () {
    this.dbg = debug(`webhooks-zendesk-ticket`)
  }

  start = async () => {
    let tickets: Ticket[] = [];
    let actualPageNumber = '1'
    while (true) {
      const listTickets = new ListTickets()
      const actualPageTickets = await listTickets.start<TicketResponse>(actualPageNumber)
      if (actualPageTickets && actualPageTickets.data.next_page) {
        tickets = [...tickets, ...actualPageTickets.data.tickets]
        actualPageNumber = (~~actualPageNumber + 1).toString()
        break;
      } else {
        break;
      }
    }

    tickets.forEach(async i => {
      await saveTickets(i)
    })
  }
}

export default Server
