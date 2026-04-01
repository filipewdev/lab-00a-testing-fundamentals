import { describe, expect, it } from "vitest";
import { formatCPF, unformatCPF, validateCPF } from "../../src/cpf";

const CPFs = {
  valid: {
    withoutMask: "12345678909",
    withMask: "123.456.789-09",
    withWhitespace: "  12345678909  ",
    withSpecialChars: "@#$%^&*()12345678909ASs",
    CNPJ: "12345678000195",
  },
  invalid: {
    empty: "",
    whitespace: " ",
    withoutMask: "12345678900",
    withMask: "123.456.789-00",
    withInvalidLength: "1234567890",
    withInvalidLengthAndMask: "123.456.789-0",
    withSameDigits: "222222222222",
    onlySpecialChars: "@#$%^&*()",
    onlyLetters: "ABCDEFGHIJklmn",
  },
};

describe("CPF Validation", () => {
  describe("should return true for valid CPFs", () => {
    it.each([
      ["unformatted",             CPFs.valid.withoutMask],
      ["formatted",               CPFs.valid.withMask],
      ["with whitespace",         CPFs.valid.withWhitespace],
      ["with special characters", CPFs.valid.withSpecialChars],
    ])("%s", (_label, cpf) => {
      expect(validateCPF(cpf)).toBe(true);
    });
  });

  describe("should return false for invalid CPFs", () => {
    it.each([
      ["empty string",                CPFs.invalid.empty],
      ["whitespace only",             CPFs.invalid.whitespace],
      ["only special characters",     CPFs.invalid.onlySpecialChars],
      ["only letters",                CPFs.invalid.onlyLetters],
      ["wrong check digits",          CPFs.invalid.withoutMask],
      ["wrong check digits (masked)", CPFs.invalid.withMask],
      ["all same digits",             CPFs.invalid.withSameDigits],
      ["too short",                   CPFs.invalid.withInvalidLength],
      ["too short (masked)",          CPFs.invalid.withInvalidLengthAndMask],
      ["CNPJ instead of CPF",         CPFs.valid.CNPJ],
    ])("%s", (_label, cpf) => {
      expect(validateCPF(cpf)).toBe(false);
    });
  });
});

describe("CPF formatting", () => {
  describe("should format valid CPFs correctly", () => {
    it.each([
      ["unformatted",             CPFs.valid.withoutMask],
      ["already formatted",      CPFs.valid.withMask],
      ["with whitespace",        CPFs.valid.withWhitespace],
      ["with special characters", CPFs.valid.withSpecialChars],
    ])("%s", (_label, cpf) => {
      expect(formatCPF(cpf)).toBe(CPFs.valid.withMask);
    });
  });

  describe("should return an empty string for invalid CPFs", () => {
    it.each([
      ["empty string",            CPFs.invalid.empty],
      ["whitespace only",         CPFs.invalid.whitespace],
      ["only special characters", CPFs.invalid.onlySpecialChars],
      ["wrong check digits",      CPFs.invalid.withoutMask],
      ["wrong check digits (masked)", CPFs.invalid.withMask],
      ["CNPJ instead of CPF",     CPFs.valid.CNPJ],
    ])("%s", (_label, cpf) => {
      expect(formatCPF(cpf)).toBe("");
    });
  });
});

describe("CPF unformatting", () => {
  describe("should unformat valid CPFs correctly", () => {
    it.each([
      ["formatted",               CPFs.valid.withMask],
      ["already unformatted",     CPFs.valid.withoutMask],
      ["with whitespace",         CPFs.valid.withWhitespace],
      ["with special characters", CPFs.valid.withSpecialChars],
    ])("%s", (_label, cpf) => {
      expect(unformatCPF(cpf)).toBe(CPFs.valid.withoutMask);
    });
  });

  describe("should return an empty string for invalid CPFs", () => {
    it.each([
      ["empty string",            CPFs.invalid.empty],
      ["whitespace only",         CPFs.invalid.whitespace],
      ["only special characters", CPFs.invalid.onlySpecialChars],
      ["only letters",            CPFs.invalid.onlyLetters],
      ["wrong check digits",      CPFs.invalid.withoutMask],
      ["wrong check digits (masked)", CPFs.invalid.withMask],
      ["CNPJ instead of CPF",     CPFs.valid.CNPJ],
    ])("%s", (_label, cpf) => {
      expect(unformatCPF(cpf)).toBe("");
    });
  });
});
