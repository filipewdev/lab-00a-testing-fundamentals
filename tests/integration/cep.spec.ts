import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { lookupCEP } from "../../src/cep";

describe("CEP Lookup", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return correct data for a valid CEP", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        cep: "70040-010",
        state: "DF",
        city: "Brasília",
        neighborhood: "Asa Norte",
        street: "SQN 415",
      }),
    } as Response);

    const result = await lookupCEP("70040010");

    expect(result).toEqual({
      cep: "70040-010",
      state: "DF",
      city: "Brasília",
      neighborhood: "Asa Norte",
      street: "SQN 415",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://brasilapi.com.br/api/cep/v1/70040010",
    );
  });

  it("should throw an error for an invalid CEP", async () => {
    await expect(lookupCEP("123")).rejects.toThrow("Invalid CEP");
  });

  it("should throw an error when the API returns a non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);
    await expect(lookupCEP("70040-010")).rejects.toThrow("CEP not found");
  });

  it("strips formatting before calling API", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        cep: "70040-010",
        street: "",
        neighborhood: "",
        city: "",
        state: "",
      }),
    } as Response);

    await lookupCEP("70040-010");

    expect(fetch).toHaveBeenCalledWith(
      "https://brasilapi.com.br/api/cep/v1/70040010",
    );
  });
});
