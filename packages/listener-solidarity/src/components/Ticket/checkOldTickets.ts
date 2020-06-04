import { extractTypeFromSubject } from "../../utils";
import { Ticket } from "../../types";
import dbg from "../../dbg";

const log = dbg.extend("checkOldTickets");

export default (subject: string, tickets: Ticket[]) => {
  log("Checking old tickets");
  const newSubject = extractTypeFromSubject(subject);
  const hasSameSubject = tickets.filter((oldTicket) => {
    const oldSubject = extractTypeFromSubject(oldTicket.subject);
    return oldSubject === newSubject;
  });

  if (hasSameSubject.length < 1) return undefined;

  // "atendimento__concluído"
  // "atendimento__iniciado"
  // "atendimento__interrompido"
  // "encaminhamento__aguardando_confirmação"
  // "encaminhamento__confirmou_disponibilidade"
  // "encaminhamento__negado"
  // "encaminhamento__realizado"
  // "encaminhamento__realizado_para_serviço_público"
  // "solicitação_recebida";

  const hasOldTickets = hasSameSubject.filter((oldTicket) => {
    const status_acolhimento = oldTicket.fields.find(
      (field) => field.id === 360014379412
    );
    if (status_acolhimento && status_acolhimento.value) {
      return (
        (status_acolhimento.value === "solicitação_recebida" ||
          status_acolhimento.value === "atendimento__iniciado" ||
          status_acolhimento.value === "encaminhamento__realizado" ||
          status_acolhimento.value ===
            "encaminhamento__realizado_para_serviço_público") &&
        oldTicket.status !== "closed" &&
        oldTicket.status !== "solved"
      );
    }
    return false;
  });

  if (hasOldTickets.length > 0) return true;
  return undefined;
};
