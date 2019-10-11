import Base from './Base'
import { Ticket } from '../interfaces/Ticket'
import dbg from './dbg'

export interface TicketResponse {
  tickets: Ticket[]
  next_page: string
  end_time: number
  count: number
}

const getTicketsByPage = (start_time: number) => Base.get<TicketResponse>(
  'incremental/tickets',
  dbg.extend('getTicketsByPage'),
  { start_time },
)

export default getTicketsByPage
