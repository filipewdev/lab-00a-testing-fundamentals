import { describe, expect, it } from "vitest";
import { formatCNPJ, unformatCNPJ, validateCNPJ } from "../../src/cnpj";

const CNPJs = {
  valid: {
    withMask: "12.345.678/0001-95",
    withoutMask: "12345678000195",
    withWhitespace: "  12345678000195  ",
    withSpecialChars: " @#$%^&*()12345678000195asASd",
    CPF: "12345678909",
  },
  invalid: {
    empty: "",
    whitespace: " ",
    withMask: "12.345.678/0001-00",
    withoutMask: "12345678000100",
    withInvalidLength: "1234567800019",
    withInvalidLengthAndMask: "12.345.678/0001-9",
    withSameDigits: "222222222222222",
    onlySpecialChars: "@#$%^&*()",
    onlyLetters: "ABCDEFGHIJklmn",
  },
};

describe("CNPJ Validation", () => {
  describe("should return true for valid CNPJs", () => {
    it.each([
      ["unformatted",             CNPJs.valid.withoutMask],
      ["formatted",               CNPJs.valid.withMask],
      ["with whitespace",         CNPJs.valid.withWhitespace],
      ["with special characters", CNPJs.valid.withSpecialChars],
    ])("%s", (_label, cnpj) => {
      expect(validateCNPJ(cnpj)).toBe(true);
    });
  });

  describe("should return false for invalid CNPJs", () => {
    it.each([
      ["empty string",                CNPJs.invalid.empty],
      ["whitespace only",             CNPJs.invalid.whitespace],
      ["only special characters",     CNPJs.invalid.onlySpecialChars],
      ["only letters",                CNPJs.invalid.onlyLetters],
      ["wrong check digits",          CNPJs.invalid.withoutMask],
      ["wrong check digits (masked)", CNPJs.invalid.withMask],
      ["all same digits",             CNPJs.invalid.withSameDigits],
      ["too short",                   CNPJs.invalid.withInvalidLength],
      ["too short (masked)",          CNPJs.invalid.withInvalidLengthAndMask],
      ["CPF instead of CNPJ",         CNPJs.valid.CPF],
    ])("%s", (_label, cnpj) => {
      expect(validateCNPJ(cnpj)).toBe(false);
    });
  });
});

describe("CNPJ formatting", () => {
  describe("should format valid CNPJs correctly", () => {
    it.each([
      ["unformatted",             CNPJs.valid.withoutMask],
      ["already formatted",      CNPJs.valid.withMask],
      ["with whitespace",        CNPJs.valid.withWhitespace],
      ["with special characters", CNPJs.valid.withSpecialChars],
    ])("%s", (_label, cnpj) => {
      expect(formatCNPJ(cnpj)).toBe(CNPJs.valid.withMask);
    });
  });

  describe("should return empty string for invalid CNPJs", () => {
    it.each([
      ["empty string",            CNPJs.invalid.empty],
      ["whitespace only",         CNPJs.invalid.whitespace],
      ["only special characters", CNPJs.invalid.onlySpecialChars],
      ["only letters",            CNPJs.invalid.onlyLetters],
      ["wrong check digits",      CNPJs.invalid.withoutMask],
      ["wrong check digits (masked)", CNPJs.invalid.withMask],
      ["CPF instead of CNPJ",     CNPJs.valid.CPF],
    ])("%s", (_label, cnpj) => {
      expect(formatCNPJ(cnpj)).toBe("");
    });
  });
});

describe("CNPJ unformatting", () => {
  describe("should unformat valid CNPJs correctly", () => {
    it.each([
      ["formatted",               CNPJs.valid.withMask],
      ["already unformatted",     CNPJs.valid.withoutMask],
      ["with special characters", CNPJs.valid.withSpecialChars],
    ])("%s", (_label, cnpj) => {
      expect(unformatCNPJ(cnpj)).toBe(CNPJs.valid.withoutMask);
    });
  });

  describe("should return empty string for invalid CNPJs", () => {
    it.each([
      ["empty string",            CNPJs.invalid.empty],
      ["whitespace only",         CNPJs.invalid.whitespace],
      ["only special characters", CNPJs.invalid.onlySpecialChars],
      ["only letters",            CNPJs.invalid.onlyLetters],
      ["wrong check digits",      CNPJs.invalid.withoutMask],
      ["wrong check digits (masked)", CNPJs.invalid.withMask],
      ["CPF instead of CNPJ",     CNPJs.valid.CPF],
    ])("%s", (_label, cnpj) => {
      expect(unformatCNPJ(cnpj)).toBe("");
    });
  });
});
