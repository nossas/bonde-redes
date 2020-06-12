import { checkOldTickets } from "../.";
import data from "../__mocks__";

describe("Testing checkOldTickets", () => {
  // Conditions:
  // oldSubject = newSubject
  // status !== "closed"
  // status !== "solved"

  // case 1:
  // no match ticket

  // case 2:
  // already has a match ticket

  const {
    tickets: { mixed, meets_no_conditions, case_one, case_two },
  } = data;

  describe("Individual has no match ticket but already subscribed", () => {
    it('should return "true" if old tickets matched stabilished conditions', async () => {
      const oldTickets = checkOldTickets(
        "[Psicológico] Igor, Belo Horizonte - MG",
        case_one as any
      );
      expect(oldTickets).toStrictEqual(16866);
    });
  });

  describe("Individual has match ticket", () => {
    it('should return "true" if old tickets matched stabilished conditions', async () => {
      const oldTickets = checkOldTickets(
        "[Psicológico] Viviane, Taubaté - SP",
        case_two as any
      );
      expect(oldTickets).toStrictEqual([19895]);
    });
  });

  it('should return "false" because no old tickets match subject', () => {
    const oldTickets = checkOldTickets(
      "[Jurídico] Teste, São Paulo - SP",
      mixed as any
    );
    expect(oldTickets).toStrictEqual(false);
  });
  it("should return 'false' if old tickets are 'closed' or 'solved'", () => {
    const oldTickets = checkOldTickets(
      "[Jurídico] Camila, Cuiabá - MT",
      mixed as any
    );
    expect(oldTickets).toStrictEqual(false);
  });
  it('should return "false" if there were no old tickets', () => {
    const oldTickets = checkOldTickets("[Jurídico] Teste, São Paulo - SP", []);
    expect(oldTickets).toStrictEqual(false);
  });
  it('should return "false" if there were no old tickets that matched stabilished conditions', () => {
    const oldTickets = checkOldTickets(
      "[Psicológico] Viviane, Taubaté - SP",
      meets_no_conditions as any
    );
    expect(oldTickets).toStrictEqual(false);
  });
});
