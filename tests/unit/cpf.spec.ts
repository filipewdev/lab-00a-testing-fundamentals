import { describe, expect, it } from "vitest";
import { formatCPF, unformatCPF, validateCPF } from "../../src/cpf";

describe("CPF Validation", () => {
  it("should return false for empty input", () => {
    expect(validateCPF("")).toBe(false);
  });
  it("should return false for whitespace-only input", () => {
    expect(validateCPF(" ")).toBe(false);
  });
  it("should be a valid CPF", () => {
    expect(validateCPF("12345678909")).toBe(true);
  });
  it("should be a valid CPF with mask", () => {
    expect(validateCPF("123.456.789-09")).toBe(true);
  });
  it("should be an invalid CPF", () => {
    expect(validateCPF("12345678900")).toBe(false);
  });
  it("should be an invalid CPF with mask", () => {
    expect(validateCPF("123.456.789-00")).toBe(false);
  });
  it("should be an invalid CPF with letters", () => {
    expect(validateCPF("1234567890A")).toBe(false);
  });
  it("should be an invalid CPF with special characters", () => {
    expect(validateCPF("123.456.789-0@")).toBe(false);
  });
  it("should be an invalid CPF with all digits the same", () => {
    expect(validateCPF("11111111111")).toBe(false);
  });
});

describe("CPF formatting", () => {
  it("should return an empty string for empty input", () => {
    expect(formatCPF("")).toBe("");
  });
  it("should return an empty string for whitespace-only input", () => {
    expect(formatCPF(" ")).toBe("");
  });
  it("should return an empty string for invalid CPF", () => {
    expect(formatCPF("12345678900")).toBe("");
  });
  it("should return an empty string with only special characters", () => {
    expect(formatCPF("  @#$%^&*()  ")).toBe("");
  });
  it("should be formatted correctly", () => {
    expect(formatCPF("12345678909")).toBe("123.456.789-09");
  });
  it("should be formatted correctly with extra characters", () => {
    expect(formatCPF("  12345678909  ")).toBe("123.456.789-09");
  });
  it("should be formatted correctly with letters and special characters", () => {
    expect(formatCPF("  12345678909A@#  ")).toBe("123.456.789-09");
  });
  it("should be formatted correctly with already formatted CPF", () => {
    expect(formatCPF("123.456.789-09")).toBe("123.456.789-09");
  });
});

describe("CPF unformatting", () => {
  it("should return an empty string for empty input", () => {
    expect(unformatCPF("")).toBe("");
  });
  it("should return an empty string for whitespace-only input", () => {
    expect(unformatCPF(" ")).toBe("");
  });
  it("should return an empty string for invalid CPF", () => {
    expect(unformatCPF("12345678900")).toBe("");
  });
  it("should return an empty string with only special characters", () => {
    expect(unformatCPF("  @#$%^&*()  ")).toBe("");
  });
  it("should be unformatted correctly", () => {
    expect(unformatCPF("123.456.789-09")).toBe("12345678909");
  });
  it("should be unformatted correctly with extra characters", () => {
    expect(unformatCPF("  123.456.789-09  ")).toBe("12345678909");
  });
  it("should be unformatted correctly with letters and special characters", () => {
    expect(unformatCPF("  123.456.789-09A@#  ")).toBe("12345678909");
  });
  it("should be unformatted correctly with already unformatted CPF", () => {
    expect(unformatCPF("12345678909")).toBe("12345678909");
  });
});
