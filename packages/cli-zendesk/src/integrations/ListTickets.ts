import Base from './Base'
import { Ticket } from '../cli'

export interface TicketResponse {
  tickets: Ticket[]
  next_page: string
  count: number
}

class ListTickets extends Base {
  constructor () {
    super('ListTickets')
  }

  start = async (page: number) => {
    return this.get<TicketResponse>('tickets', {page})
  }
}
export default ListTickets
