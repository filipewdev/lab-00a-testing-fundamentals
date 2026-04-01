/** Address data returned by the CEP lookup API. */
interface CEPResult {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

/**
 * Validates a Brazilian CEP (Código de Endereçamento Postal).
 * A valid CEP has exactly 8 digits after stripping non-digit characters.
 *
 * @param cep - The CEP string to validate (formatted or unformatted)
 * @returns `true` if the CEP has 8 digits, `false` otherwise
 *
 * @example
 * validateCEP("70040010")   // true
 * validateCEP("70040-010")  // true
 * validateCEP("1234")       // false
 */
function validateCEP(cep: string): boolean {
  const digitsOnly = (cep || "").trim().replace(/\D/g, "");
  return digitsOnly.length === 8;
}

/**
 * Formats a valid CEP string into the standard "XXXXX-XXX" pattern.
 * Returns an empty string if the CEP is invalid.
 *
 * @param cep - The CEP string to format
 * @returns The formatted CEP, or `""` if invalid
 *
 * @example
 * formatCEP("70040010")   // "70040-010"
 * formatCEP("70040-010")  // "70040-010"
 * formatCEP("123")        // ""
 */
function formatCEP(cep: string): string {
  const isCEPValid = validateCEP(cep);
  if (!isCEPValid) return "";

  const digitsOnly = (cep || "").trim().replace(/\D/g, "");
  return digitsOnly.replace(/(\d{5})(\d{3})/, "$1-$2");
}

/**
 * Removes formatting from a valid CEP, returning only its 8 digits.
 * Returns an empty string if the CEP is invalid.
 *
 * @param cep - The CEP string to unformat
 * @returns The unformatted CEP (digits only), or `""` if invalid
 *
 * @example
 * unformatCEP("70040-010")  // "70040010"
 * unformatCEP("invalid")    // ""
 */
function unformatCEP(cep: string): string {
  const isCEPValid = validateCEP(cep);
  if (!isCEPValid) return "";

  const digitsOnly = (cep || "").trim().replace(/\D/g, "");
  return digitsOnly;
}

/**
 * Looks up a Brazilian address by CEP using the BrasilAPI.
 *
 * Validates the CEP format before making the HTTP request. Throws on invalid
 * input or when the API returns a non-ok response.
 *
 * @param cep - The CEP to look up (formatted or unformatted)
 * @returns A promise that resolves to the address data
 * @throws {Error} "Invalid CEP" if the input doesn't have 8 digits
 * @throws {Error} "CEP not found" if the API returns a non-ok response
 *
 * @example
 * const address = await lookupCEP("70040010");
 * console.log(address.city);  // "Brasília"
 * console.log(address.state); // "DF"
 */
async function lookupCEP(cep: string): Promise<CEPResult> {
  if (!validateCEP(cep)) throw new Error("Invalid CEP");

  const unformatedCEP = unformatCEP(cep);

  const lookupURL = `https://brasilapi.com.br/api/cep/v1/${unformatedCEP}`;

  const response = await fetch(lookupURL);
  if (!response.ok) throw new Error("CEP not found");

  const data = await response.json();

  return {
    cep: data.cep,
    state: data.state,
    city: data.city,
    neighborhood: data.neighborhood,
    street: data.street,
  };
}

export { validateCEP, formatCEP, unformatCEP, lookupCEP, CEPResult };

// Future additions:
// - lookupCEPWithFallback(cep: string): Promise<CEPResult> — try BrasilAPI, fall back to ViaCEP
// - getCEPRange(state: string): { start: string; end: string } — return the CEP range for a given state
// - validateCEPRange(cep: string, state: string): boolean — check if a CEP belongs to the expected state
