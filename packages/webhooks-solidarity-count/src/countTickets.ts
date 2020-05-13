import { TicketZendesk, customFields } from "./interfaces/Ticket";

const countTickets = (tickets: Array<TicketZendesk & customFields>) => {
  const userCount = {
    atendimentos_em_andamento_calculado_: 0,
    atendimentos_concludos_calculado_: 0,
    encaminhamentos_realizados_calculado_: 0
  };

  tickets
    .filter(i => i.status === "pending")
    .map(i => {
      switch (i.status_acolhimento) {
        case "atendimento__iniciado":
          userCount.atendimentos_em_andamento_calculado_ += 1;
          break;
        case "atendimento__concluído":
          userCount.atendimentos_concludos_calculado_ += 1;
          break;
        case "encaminhamento__realizado":
          userCount.encaminhamentos_realizados_calculado_ += 1;
          break;
        default:
          return false;
      }
      return false;
    });

  return userCount;
};

export default countTickets;
