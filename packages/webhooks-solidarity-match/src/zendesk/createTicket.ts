import Base from './Base'
import { Ticket } from '../interfaces/Ticket'
import dbg from './dbg'

const createTicket = (ticket: Partial<Ticket>) => Base.post('tickets', dbg.extend('createTicket'), {
  ticket,
})

export default createTicket
