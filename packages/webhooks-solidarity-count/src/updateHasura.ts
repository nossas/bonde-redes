import { TicketHasuraIn } from "./interfaces/Ticket";
import saveTicket from "./hasura/saveTickets";
import dbg from "./dbg";

const updateHasura = async (ticket: TicketHasuraIn): Promise<boolean> => {
  try {
    const response = await saveTicket([ticket]);
    return typeof response === "number";
  } catch (e) {
    dbg.extend("updateHasura")(e);
  }

  return false;
};

export default updateHasura;
