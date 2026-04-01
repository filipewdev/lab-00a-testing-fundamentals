import { describe, expect, it } from "vitest";
import { formatCPF, unformatCPF, validateCPF } from "../../src/cpf";

const CPFs = {
  valid: {
    withoutMask: "12345678909",
    withMask: "123.456.789-09",
    withWhitespace: "  12345678909  ",
    withWhitespaceAndSpecialChars: "  @#$%^&*()  12345678909  ",
    CNPJ: "12345678000195",
  },
  invalid: {
    empty: "",
    whitespace: " ",
    withoutMask: "12345678900",
    withMask: "123.456.789-00",
    withInvalidLength: "1234567890",
    withInvalidLengthAndMask: "123.456.789-0",
    withLetters: "1234567890A",
    withSpecialChars: "123.456.789-0@",
    withSameDigits: "11111111111",
    withOnlySpecialChars: "@#$%^&*()",
  },
};

describe("CPF Validation", () => {
  describe("should return true for valid CPFs", () => {
    it("valid CPF without mask", () => {
      expect(validateCPF(CPFs.valid.withoutMask)).toBe(true);
    });
    it("valid CPF with mask", () => {
      expect(validateCPF(CPFs.valid.withMask)).toBe(true);
    });
    it("valid CPF with whitespace", () => {
      expect(validateCPF(CPFs.valid.withWhitespace)).toBe(true);
    });
    it("valid CPF with letters and special characters", () => {
      expect(validateCPF(CPFs.valid.withWhitespaceAndSpecialChars)).toBe(true);
    });
  });

  describe("should return false for invalid CPFs", () => {
    it("empty string", () => {
      expect(validateCPF(CPFs.invalid.empty)).toBe(false);
    });
    it("string with only whitespace", () => {
      expect(validateCPF(CPFs.invalid.whitespace)).toBe(false);
    });
    it("invalid CPF without mask", () => {
      expect(validateCPF(CPFs.invalid.withoutMask)).toBe(false);
    });
    it("invalid CPF with mask", () => {
      expect(validateCPF(CPFs.invalid.withMask)).toBe(false);
    });
    it("invalid CPF with letters", () => {
      expect(validateCPF(CPFs.invalid.withLetters)).toBe(false);
    });
    it("invalid CPF with special characters", () => {
      expect(validateCPF(CPFs.invalid.withSpecialChars)).toBe(false);
    });
    it("invalid CPF with all digits the same", () => {
      expect(validateCPF(CPFs.invalid.withSameDigits)).toBe(false);
    });
    it("invalid CPF with invalid length", () => {
      expect(validateCPF(CPFs.invalid.withInvalidLength)).toBe(false);
    });
    it("invalid CPF with invalid length and mask", () => {
      expect(validateCPF(CPFs.invalid.withInvalidLengthAndMask)).toBe(false);
    });
    it("CNPJ instead of CPF", () => {
      expect(validateCPF(CPFs.valid.CNPJ)).toBe(false);
    });
    it("string with only special characters", () => {
      expect(validateCPF(CPFs.invalid.withOnlySpecialChars)).toBe(false);
    });
  });
});

describe("CPF formatting", () => {
  describe("should format valid CPFs correctly", () => {
    it("valid CPF without mask", () => {
      expect(formatCPF(CPFs.valid.withoutMask)).toBe(CPFs.valid.withMask);
    });
    it("valid CPF already formatted", () => {
      expect(formatCPF(CPFs.valid.withMask)).toBe(CPFs.valid.withMask);
    });
    it("valid CPF with extra characters", () => {
      expect(formatCPF(CPFs.valid.withWhitespace)).toBe(CPFs.valid.withMask);
    });
    it("valid CPF with letters and special characters", () => {
      expect(formatCPF(CPFs.valid.withWhitespaceAndSpecialChars)).toBe(
        CPFs.valid.withMask,
      );
    });
  });

  describe("should return an empty string for invalid CPFs", () => {
    it("empty string", () => {
      expect(formatCPF(CPFs.invalid.empty)).toBe("");
    });
    it("string with only whitespace", () => {
      expect(formatCPF(CPFs.invalid.whitespace)).toBe("");
    });
    it("string with only special characters", () => {
      expect(formatCPF(CPFs.invalid.withOnlySpecialChars)).toBe("");
    });
    it("invalid CPF without mask", () => {
      expect(formatCPF(CPFs.invalid.withoutMask)).toBe("");
    });
    it("invalid CPF with mask", () => {
      expect(formatCPF(CPFs.invalid.withMask)).toBe("");
    });
    it("CNPJ instead of CPF", () => {
      expect(formatCPF(CPFs.valid.CNPJ)).toBe("");
    });
  });
});

describe("CPF unformatting", () => {
  describe("should unformat valid CPFs correctly", () => {
    it("valid CPF with mask", () => {
      expect(unformatCPF(CPFs.valid.withMask)).toBe(CPFs.valid.withoutMask);
    });
    it("valid CPF already unformatted", () => {
      expect(unformatCPF(CPFs.valid.withoutMask)).toBe(CPFs.valid.withoutMask);
    });
    it("valid CPF with extra characters", () => {
      expect(unformatCPF(CPFs.valid.withWhitespace)).toBe(
        CPFs.valid.withoutMask,
      );
    });
    it("valid CPF with letters and special characters", () => {
      expect(unformatCPF(CPFs.valid.withWhitespaceAndSpecialChars)).toBe(
        CPFs.valid.withoutMask,
      );
    });
  });

  describe("should return an empty string for invalid CPFs", () => {
    it("empty string", () => {
      expect(unformatCPF(CPFs.invalid.empty)).toBe("");
    });
    it("string with only whitespace", () => {
      expect(unformatCPF(CPFs.invalid.whitespace)).toBe("");
    });
    it("string with only special characters", () => {
      expect(unformatCPF(CPFs.invalid.withOnlySpecialChars)).toBe("");
    });
    it("invalid CPF without mask", () => {
      expect(unformatCPF(CPFs.invalid.withoutMask)).toBe("");
    });
    it("invalid CPF with mask", () => {
      expect(unformatCPF(CPFs.invalid.withMask)).toBe("");
    });
    it("CNPJ instead of CPF", () => {
      expect(unformatCPF(CPFs.valid.CNPJ)).toBe("");
    });
  });
});
