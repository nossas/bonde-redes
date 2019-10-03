import Base from './Base'
import { Ticket } from '../interfaces/Ticket'
import dbg from './dbg'

export interface TicketResponse {
  tickets: Ticket[]
  next_page: string
  count: number
}

const getTicketsByPage = (page: number) => {
  return Base.get<TicketResponse>('tickets', dbg.extend('getTicketsByPage'), {page, start_time: new Date().getTime()/1000})
}

export default getTicketsByPage
