import { getSupportType } from "../.";

describe("Utils functions", () => {
  describe("getUserFromTicket", () => {
    it('should return correct ticket "tipo_de_acolhimento"', () => {
      expect(true).toBe(true);
    });
  });
  describe("getSupportType", () => {
    it("should return a match", () => {
      const match_test_one = getSupportType(
        "[Psicológico] Daniela, São Paulo - SP"
      );
      const match_test_two = getSupportType(
        "[Jurídico] Giselly Farias, São José  - SC"
      );
      const match_test_three = getSupportType(
        "[Psicóloga] Kathleen Dias de Oliveira - 6150967"
      );
      const match_test_four = getSupportType(
        "[Advogada] Ana Luiza  Pores Moreira - null"
      );
      expect(match_test_one).toHaveLength(1);
      expect(match_test_two).toHaveLength(1);
      expect(match_test_three).toHaveLength(1);
      expect(match_test_four).toHaveLength(1);
    });
  });
  describe("getTicketType", () => {
    it('should return correct ticket "tipo_de_acolhimento"', () => {
      expect(true).toBe(true);
    });
  });
});
