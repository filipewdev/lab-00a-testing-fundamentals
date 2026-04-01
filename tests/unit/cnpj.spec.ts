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
    it("valid CNPJ without mask", () => {
      expect(validateCNPJ(CNPJs.valid.withoutMask)).toBe(true);
    });
    it("valid CNPJ with mask", () => {
      expect(validateCNPJ(CNPJs.valid.withMask)).toBe(true);
    });
    it("valid CNPJ with whitespace", () => {
      expect(validateCNPJ(CNPJs.valid.withWhitespace)).toBe(true);
    });
    it("valid CNPJ with letter and special characters", () => {
      expect(validateCNPJ(CNPJs.valid.withSpecialChars)).toBe(true);
    });
  });

  describe("should return false for invalid CNPJs", () => {
    it("empty string", () => {
      expect(validateCNPJ(CNPJs.invalid.empty)).toBe(false);
    });
    it("string with only whitespace", () => {
      expect(validateCNPJ(CNPJs.invalid.whitespace)).toBe(false);
    });
    it("string with only special characters", () => {
      expect(validateCNPJ(CNPJs.invalid.onlySpecialChars)).toBe(false);
    });
    it("string with only letters", () => {
      expect(validateCNPJ(CNPJs.invalid.onlyLetters)).toBe(false);
    });
    it("invalid CNPJ without mask", () => {
      expect(validateCNPJ(CNPJs.invalid.withoutMask)).toBe(false);
    });
    it("invalid CNPJ with mask", () => {
      expect(validateCNPJ(CNPJs.invalid.withMask)).toBe(false);
    });
    it("invalid CNPJ with all digits the same", () => {
      expect(validateCNPJ(CNPJs.invalid.withSameDigits)).toBe(false);
    });
    it("invalid CNPJ with invalid length", () => {
      expect(validateCNPJ(CNPJs.invalid.withInvalidLength)).toBe(false);
    });
    it("invalid CNPJ with invalid length and mask", () => {
      expect(validateCNPJ(CNPJs.invalid.withInvalidLengthAndMask)).toBe(false);
    });
    it("CPF instead of CNPJ", () => {
      expect(validateCNPJ(CNPJs.valid.CPF)).toBe(false);
    });
  });
});

describe("CNPJ formatting", () => {
  describe("should format valid CNPJs correctly", () => {
    it("valid CNPJ without mask", () => {
      expect(formatCNPJ(CNPJs.valid.withoutMask)).toBe(CNPJs.valid.withMask);
    });
    it("valid CNPJ already formatted", () => {
      expect(formatCNPJ(CNPJs.valid.withMask)).toBe(CNPJs.valid.withMask);
    });
    it("valid CNPJ with whitespace", () => {
      expect(formatCNPJ(CNPJs.valid.withWhitespace)).toBe(CNPJs.valid.withMask);
    });
    it("valid CNPJ with letter and special characters", () => {
      expect(formatCNPJ(CNPJs.valid.withSpecialChars)).toBe(
        CNPJs.valid.withMask,
      );
    });
  });

  describe("should return empty string for invalid CNPJs", () => {
    it("empty string", () => {
      expect(formatCNPJ(CNPJs.invalid.empty)).toBe("");
    });
    it("string with only whitespace", () => {
      expect(formatCNPJ(CNPJs.invalid.whitespace)).toBe("");
    });
    it("string with only special characters", () => {
      expect(formatCNPJ(CNPJs.invalid.onlySpecialChars)).toBe("");
    });
    it("string with only letters", () => {
      expect(formatCNPJ(CNPJs.invalid.onlyLetters)).toBe("");
    });
    it("invalid CNPJ without mask", () => {
      expect(formatCNPJ(CNPJs.invalid.withoutMask)).toBe("");
    });
    it("invalid CNPJ with mask", () => {
      expect(formatCNPJ(CNPJs.invalid.withMask)).toBe("");
    });
    it("CPF instead of CNPJ", () => {
      expect(formatCNPJ(CNPJs.valid.CPF)).toBe("");
    });
  });
});

describe("CNPJ unformatting", () => {
  describe("should unformat valid CNPJs correctly", () => {
    it("valid CNPJ with mask", () => {
      expect(unformatCNPJ(CNPJs.valid.withMask)).toBe(CNPJs.valid.withoutMask);
    });
    it("valid CNPJ already unformatted", () => {
      expect(unformatCNPJ(CNPJs.valid.withoutMask)).toBe(
        CNPJs.valid.withoutMask,
      );
    });
    it("valid CNPJ with letter and special characters", () => {
      expect(unformatCNPJ(CNPJs.valid.withSpecialChars)).toBe(
        CNPJs.valid.withoutMask,
      );
    });
  });

  describe("should return empty string for invalid CNPJs", () => {
    it("empty string", () => {
      expect(unformatCNPJ(CNPJs.invalid.empty)).toBe("");
    });
    it("string with only whitespace", () => {
      expect(unformatCNPJ(CNPJs.invalid.whitespace)).toBe("");
    });
    it("string with only special characters", () => {
      expect(unformatCNPJ(CNPJs.invalid.onlySpecialChars)).toBe("");
    });
    it("string with only letters", () => {
      expect(unformatCNPJ(CNPJs.invalid.onlyLetters)).toBe("");
    });
    it("invalid CNPJ without mask", () => {
      expect(unformatCNPJ(CNPJs.invalid.withoutMask)).toBe("");
    });
    it("invalid CNPJ with mask", () => {
      expect(unformatCNPJ(CNPJs.invalid.withMask)).toBe("");
    });
    it("CPF instead of CNPJ", () => {
      expect(unformatCNPJ(CNPJs.valid.CPF)).toBe("");
    });
  });
});
