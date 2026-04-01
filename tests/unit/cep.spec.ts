import { describe, expect, it } from "vitest";
import { formatCEP, unformatCEP, validateCEP } from "../../src/cep";

const CEPs = {
  valid: {
    unformatted: "12345678",
    formatted: "12345-678",
    withWhitespaces: "12345 - 678",
    withSpecialChars: "12345@678asA",
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

describe("CEP validation", () => {
  describe("should return true for valid CEPs", () => {
    it.each([
      ["unformatted",             CEPs.valid.unformatted],
      ["formatted",               CEPs.valid.formatted],
      ["with whitespaces",        CEPs.valid.withWhitespaces],
      ["with special characters", CEPs.valid.withSpecialChars],
    ])("%s", (_label, cep) => {
      expect(validateCEP(cep)).toBe(true);
    });
  });

  describe("should return false for invalid CEPs", () => {
    it.each([
      ["empty string",            CEPs.invalid.empty],
      ["whitespace only",         CEPs.invalid.whitespaces],
      ["too few digits",          CEPs.invalid.tooShort],
      ["too many digits",         CEPs.invalid.tooLong],
      ["only letters",            CEPs.invalid.onlyLetters],
      ["only special characters", CEPs.invalid.onlySpecialChars],
    ])("%s", (_label, cep) => {
      expect(validateCEP(cep)).toBe(false);
    });
  });
});

describe("CEP formatting", () => {
  describe("should format valid CEPs correctly", () => {
    it.each([
      ["unformatted",             CEPs.valid.unformatted],
      ["already formatted",      CEPs.valid.formatted],
      ["with whitespaces",       CEPs.valid.withWhitespaces],
      ["with special characters", CEPs.valid.withSpecialChars],
    ])("%s", (_label, cep) => {
      expect(formatCEP(cep)).toBe(CEPs.valid.formatted);
    });
  });

  describe("should return empty string for invalid CEPs", () => {
    it.each([
      ["empty string",            CEPs.invalid.empty],
      ["whitespace only",         CEPs.invalid.whitespaces],
      ["too few digits",          CEPs.invalid.tooShort],
      ["too many digits",         CEPs.invalid.tooLong],
      ["only letters",            CEPs.invalid.onlyLetters],
      ["only special characters", CEPs.invalid.onlySpecialChars],
    ])("%s", (_label, cep) => {
      expect(formatCEP(cep)).toBe("");
    });
  });
});

describe("CEP unformatting", () => {
  describe("should unformat valid CEPs correctly", () => {
    it.each([
      ["unformatted",             CEPs.valid.unformatted],
      ["formatted",               CEPs.valid.formatted],
      ["with whitespaces",       CEPs.valid.withWhitespaces],
      ["with special characters", CEPs.valid.withSpecialChars],
    ])("%s", (_label, cep) => {
      expect(unformatCEP(cep)).toBe(CEPs.valid.unformatted);
    });
  });

  describe("should return empty string for invalid CEPs", () => {
    it.each([
      ["empty string",            CEPs.invalid.empty],
      ["whitespace only",         CEPs.invalid.whitespaces],
      ["too few digits",          CEPs.invalid.tooShort],
      ["too many digits",         CEPs.invalid.tooLong],
      ["only letters",            CEPs.invalid.onlyLetters],
      ["only special characters", CEPs.invalid.onlySpecialChars],
    ])("%s", (_label, cep) => {
      expect(unformatCEP(cep)).toBe("");
    });
  });
});
