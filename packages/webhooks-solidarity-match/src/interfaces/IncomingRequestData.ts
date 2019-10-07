import { Ticket } from "./Ticket";

export interface IncomingRequestData {
  event: {
    data: {
      new: Ticket
    }
  }
}
