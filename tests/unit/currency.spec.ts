import { describe, expect, it } from "vitest";
import { formatBRL, parseBRL } from "../../src/currency";

describe("Currency Formatting", () => {
  describe("should format number to BRL currency string", () => {
    it("integer numbers", () => {
      expect(formatBRL(1234)).toBe("R$ 1.234,00");
    });
    it("floating-point numbers", () => {
      expect(formatBRL(1234.5)).toBe("R$ 1.234,50");
    });
    it("zero", () => {
      expect(formatBRL(0)).toBe("R$ 0,00");
    });
    it("negative numbers", () => {
      expect(formatBRL(-567.89)).toBe("-R$ 567,89");
    });
    it("large numbers", () => {
      expect(formatBRL(123456789.99)).toBe("R$ 123.456.789,99");
    });
    it("numbers with more than two decimal places", () => {
      expect(formatBRL(1234.5678)).toBe("R$ 1.234,57");
    });
  });
});

describe("Currency Parsing", () => {
  describe("should parse BRL currency string to number", () => {
    it("positive numbers", () => {
      expect(parseBRL("R$ 1.234,50")).toBe(1234.5);
    });

    it("zero", () => {
      expect(parseBRL("R$ 0,00")).toBe(0);
    });

    it("negative numbers", () => {
      expect(parseBRL("R$ -567,89")).toBe(-567.89);
    });

    it("large numbers with multiple thousands separators", () => {
      expect(parseBRL("R$ 1.234.567,89")).toBe(1234567.89);
    });

    it("negative numbers with thousands separators", () => {
      expect(parseBRL("R$ -1.234,50")).toBe(-1234.5);
    });
  });

  describe("should throw an error for invalid BRL format", () => {
    it("empty string", () => {
      expect(() => parseBRL("")).toThrow("Invalid BRL format");
    });

    it("whitespace only string", () => {
      expect(() => parseBRL(" ")).toThrow("Invalid BRL format");
    });

    it("non-numeric string", () => {
      expect(() => parseBRL("abc")).toThrow("Invalid BRL format");
    });

    it("string with non-BRL currency symbol", () => {
      expect(() => parseBRL("$1234.56")).toThrow("Invalid BRL format");
    });
  });
});
