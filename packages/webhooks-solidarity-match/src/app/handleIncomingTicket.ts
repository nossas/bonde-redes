import { IncomingRequestData } from "../interfaces/IncomingRequestData";

const handleIncomingTicket = (data: IncomingRequestData) => {
  return data.event.data.new
}

export default handleIncomingTicket
