import { Ticket } from "./Ticket";

export interface IncomingRequestData {
  payload: {
    event: {
      data: {
        new: Ticket
      }
    }
  }
}
