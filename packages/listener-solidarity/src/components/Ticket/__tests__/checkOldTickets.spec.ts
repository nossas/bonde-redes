import { checkOldTickets } from "../.";
import data from "../__mocks__";

describe("Testing checkOldTickets", () => {
  // Conditions:
  // oldSubject = newSubject
  // status_acolhimento ="solicitação_recebida"
  // status_acolhimento = "atendimento__iniciado"
  // status_acolhimento = "encaminhamento__realizado"
  // status_acolhimento = "encaminhamento__realizado_para_serviço_público"
  // status !== "closed"
  // status !== "solved"

  const {
    tickets: { mixed, meets_no_conditions, meets_conditions },
  } = data;

  it('should return "true" if old tickets matched stabilished conditions', async () => {
    const oldTickets = checkOldTickets(
      "[Psicológico] Igor, Belo Horizonte - MG",
      mixed as any
    );
    expect(oldTickets).toStrictEqual(true);
  });
  it('should return "true" if old tickets matched stabilished conditions', async () => {
    const oldTickets = checkOldTickets(
      "[Psicológico] Viviane, Taubaté - SP",
      meets_conditions as any
    );
    expect(oldTickets).toStrictEqual(true);
  });
  it('should return "undefined" because no old tickets match subject', () => {
    const oldTickets = checkOldTickets(
      "[Jurídico] Teste, São Paulo - SP",
      mixed as any
    );
    expect(oldTickets).toStrictEqual(undefined);
  });
  it("should return 'undefined' if old tickets are 'closed' or 'solved'", () => {
    const oldTickets = checkOldTickets(
      "[Jurídico] Camila, Cuiabá - MT",
      mixed as any
    );
    expect(oldTickets).toStrictEqual(undefined);
  });
  it('should return "undefined" if there were no old tickets', () => {
    const oldTickets = checkOldTickets("[Jurídico] Teste, São Paulo - SP", []);
    expect(oldTickets).toStrictEqual(undefined);
  });
  it('should return "undefined" if there were no old tickets that matched stabilished conditions', () => {
    const oldTickets = checkOldTickets(
      "[Psicológico] Viviane, Taubaté - SP",
      meets_no_conditions as any
    );
    expect(oldTickets).toStrictEqual(undefined);
  });
});
