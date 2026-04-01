import { describe, expect, it } from "vitest";
import { formatCEP, unformatCEP } from "../../src/cep";

const CEPs = {
  valid: {
    unformatted: "12345678",
    formatted: "12345-678",
    withWhitespaces: "12345 - 678",
    withSpecialChars: "12345@678",
  },
  invalid: {
    empty: "",
    whitespaces: " ",
    tooShort: "1234567",
    tooLong: "123456789",
    onlyLetters: "ABCDEFGHIJklmn",
    onlySpecialChars: "@#$%^&*()",
  },
};

describe("CEP formatting", () => {
  describe("should format valid CEPs correctly", () => {
    it("valid CEP without mask", () => {
      expect(formatCEP(CEPs.valid.unformatted)).toBe(CEPs.valid.formatted);
    });
    it("valid CEP with mask", () => {
      expect(formatCEP(CEPs.valid.formatted)).toBe(CEPs.valid.formatted);
    });
    it("valid CEP with whitespaces", () => {
      expect(formatCEP(CEPs.valid.withWhitespaces)).toBe(CEPs.valid.formatted);
    });
    it("valid CEP with special characters", () => {
      expect(formatCEP(CEPs.valid.withSpecialChars)).toBe(CEPs.valid.formatted);
    });
  });

  describe("should return empty string for invalid CEPs", () => {
    it("empty string", () => {
      expect(formatCEP(CEPs.invalid.empty)).toBe("");
    });
    it("whitespace string", () => {
      expect(formatCEP(CEPs.invalid.whitespaces)).toBe("");
    });
    it("CEP with too few digits", () => {
      expect(formatCEP(CEPs.invalid.tooShort)).toBe("");
    });
    it("CEP with too many digits", () => {
      expect(formatCEP(CEPs.invalid.tooLong)).toBe("");
    });
    it("string with only letters", () => {
      expect(formatCEP(CEPs.invalid.onlyLetters)).toBe("");
    });
    it("string with only special characters", () => {
      expect(formatCEP(CEPs.invalid.onlySpecialChars)).toBe("");
    });
  });
});

describe("CEP unformatting", () => {
  describe("should unformat valid CEPs correctly", () => {
    it("valid CEP without mask", () => {
      expect(unformatCEP(CEPs.valid.unformatted)).toBe(CEPs.valid.unformatted);
    });
    it("valid CEP with mask", () => {
      expect(unformatCEP(CEPs.valid.formatted)).toBe(CEPs.valid.unformatted);
    });
    it("valid CEP with whitespaces", () => {
      expect(unformatCEP(CEPs.valid.withWhitespaces)).toBe(
        CEPs.valid.unformatted,
      );
    });
    it("valid CEP with special characters", () => {
      expect(unformatCEP(CEPs.valid.withSpecialChars)).toBe(
        CEPs.valid.unformatted,
      );
    });
  });

  describe("should return empty string for invalid CEPs", () => {
    it("empty string", () => {
      expect(unformatCEP(CEPs.invalid.empty)).toBe("");
    });
    it("whitespace string", () => {
      expect(unformatCEP(CEPs.invalid.whitespaces)).toBe("");
    });
    it("CEP with too few digits", () => {
      expect(unformatCEP(CEPs.invalid.tooShort)).toBe("");
    });
    it("CEP with too many digits", () => {
      expect(unformatCEP(CEPs.invalid.tooLong)).toBe("");
    });
    it("string with only letters", () => {
      expect(unformatCEP(CEPs.invalid.onlyLetters)).toBe("");
    });
    it("string with only special characters", () => {
      expect(unformatCEP(CEPs.invalid.onlySpecialChars)).toBe("");
    });
  });
});
