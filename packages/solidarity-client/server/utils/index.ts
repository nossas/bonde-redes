import { LAWYER, THERAPIST } from "../parse/index";

export const getUserFromTicket = (users, ticket) =>
  users.filter(user => user.user_id === ticket.requester_id);

export const getSupportType = subject => {
  const str = subject.toLowerCase();
  const removeSpecialCaracters = str.replace(/[^\w\s]/gi, "");
  // retorna se no subject existe algum match dos termos
  const match = removeSpecialCaracters.match(
    /\b(psicolgico|jurdico|psicloga|advogada)\b/g
  );
  return match && match.length > 0 ? match : [];
};

// is welcoming ticket and ticket has user (according to user hasura query)
export const isValidTicket = (users, ticket) => {
  return (
    getSupportType(ticket.subject).length > 0 &&
    getUserFromTicket(users, ticket).length > 0
  );
};

export const getTicketType = (type, subject) => {
  if (typeof type === "undefined" || type === null) {
    return "-";
  }
  const match = getSupportType(subject);
  if (match.length > 0) {
    return match[0] === "jurdico" ? "jurídico" : "psicológico";
  }
  return "-";
};

export const volunteer_type = (
  input: number
): "jurídico" | "psicológico" | null => {
  if (input === LAWYER) return "jurídico";
  if (input === THERAPIST) return "psicológico";
  return null;
};

export const fuseTicketsAndUsers = (users, tickets) =>
  tickets
    .filter(ticket => isValidTicket(users, ticket))
    .map(ticket => {
      const user = getUserFromTicket(users, ticket)[0];
      return {
        ...ticket,
        ...user,
        ticket_status: ticket.status,
        ticket_created_at: ticket.created_at,
        tipo_de_acolhimento: getTicketType(
          user.tipo_de_acolhimento,
          ticket.subject
        )
      };
    });
