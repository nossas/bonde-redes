import * as yup from "yup";
import dbg from "./dbg";
import { TicketHasuraIn } from "./interfaces/Ticket";
import { ORGANIZATIONS } from "./interfaces/Organizations";

const verifyOrganization = async (ticket: TicketHasuraIn) => {
  const { ZENDESK_ORGANIZATIONS } = process.env;
  try {
    const organizations = await yup
      .object({
        ADVOGADA: yup.number().required(),
        MSR: yup.number().required(),
        PSICOLOGA: yup.number().required()
      })
      .required()
      .validate(JSON.parse(ZENDESK_ORGANIZATIONS));

    const { organization_id } = ticket;
    switch (organization_id) {
      case organizations.ADVOGADA:
        return ORGANIZATIONS.ADVOGADA;
      case organizations.MSR:
        return ORGANIZATIONS.MSR;
      case organizations.PSICOLOGA:
        return ORGANIZATIONS.PSICOLOGA;
      default:
        return null;
    }
  } catch (e) {
    dbg.extend("verifyOrganization")(e);
    return null;
  }
};

export default verifyOrganization;
