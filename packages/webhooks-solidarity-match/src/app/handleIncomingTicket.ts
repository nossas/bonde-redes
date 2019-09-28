import { IncomingRequestData } from "../interfaces/IncomingRequestData";

const handleIncomingTicket = (data: IncomingRequestData) => {
  return data.payload.event.data.new
}

export default handleIncomingTicket
