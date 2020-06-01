import {
  extractTypeFromSubject,
  getOrganizationType,
  capitalize,
  formatDate,
} from "../";

describe("Utils", () => {
  describe('should return "psicológico" ou "jurídico"', () => {
    it('should return "psicológico"', () => {
      const therapist = extractTypeFromSubject(
        "[Psicológico] Joseane, Curitiba - PR"
      );
      expect(therapist).toEqual("psicológico");
    });
    it('should return "jurídico"', () => {
      const lawyer = extractTypeFromSubject(
        "[Jurídico] Joseane, Curitiba - PR"
      );
      expect(lawyer).toEqual("jurídico");
    });
  });

  describe("should return correct organization based on widget id", () => {
    it('should return "THERAPIST"', () => {
      expect(getOrganizationType(2760)).toEqual("THERAPIST");
      expect(getOrganizationType(16835)).toEqual("THERAPIST");
      expect(getOrganizationType(17628)).toEqual("THERAPIST");
    });
    it('should return "LAWYER"', () => {
      expect(getOrganizationType(8190)).toEqual("LAWYER");
      expect(getOrganizationType(16838)).toEqual("LAWYER");
      expect(getOrganizationType(17633)).toEqual("LAWYER");
    });
    it('should return "MSR"', () => {
      expect(getOrganizationType(3297)).toEqual("MSR");
      expect(getOrganizationType(16850)).toEqual("MSR");
    });
  });

  describe("should capitalize words", () => {
    it("capitalizes", () => {
      expect(capitalize("mapa do acolhimento")).toEqual("Mapa do acolhimento");
      expect(capitalize("na fé irmão")).toEqual("Na fé irmão");
      expect(capitalize("tech for good")).toEqual("Tech for good");
    });
  });

  describe("should format timestamp according to zendesk format", () => {
    // reference: https://develop.zendesk.com/hc/en-us/community/posts/360001644768-Format-to-pass-Date-field-type
    it("formats", () => {
      expect(formatDate("2020-03-05T11:28:01.48789")).toEqual("2020-03-05");
      expect(formatDate("2019-03-23T23:22:48.813946")).toEqual("2019-03-23");
      expect(formatDate("2018-03-10T11:28:01.48789")).toEqual("2018-03-10");
    });
  });
});
