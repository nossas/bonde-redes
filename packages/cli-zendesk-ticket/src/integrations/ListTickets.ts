import Base from './Base'
import { Ticket } from '../cli'

export interface TicketResponse {
  tickets: Ticket[]
  next_page: string
  count: number
}

class ListTickets extends Base {
  constructor () {
    super('ListTickets', `tickets`, 'GET')
  }

  start = async (page?: string) => {
    return this.send<TicketResponse>(page)
  }
}
export default ListTickets
