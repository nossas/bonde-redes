import { IncomingRequestData } from '../interfaces/IncomingRequestData'

const handleIncomingTicket = (data: IncomingRequestData) => data.event.data.new

export default handleIncomingTicket
