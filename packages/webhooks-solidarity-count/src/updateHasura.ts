import { Ticket } from "./interfaces/Ticket"
import saveTicket from "./hasura/saveTickets"
import dbg from "./dbg"

const updateHasura = async (ticket: Ticket): Promise<boolean> => {
  try {
    const response = await saveTicket([ticket])
    return response.status === 200
  } catch (e) {
    dbg.extend('updateHasura')(e)
  }

  return false
}

export default updateHasura
