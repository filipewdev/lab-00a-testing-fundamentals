/**
 * Formats a numeric value into a Brazilian Real (BRL) currency string
 * using the "pt-BR" locale (e.g. "R$ 1.234,50").
 *
 * Rounds to 2 decimal places using `Intl.NumberFormat` banker's rounding.
 *
 * @param amount - The numeric value to format
 * @returns The formatted BRL string
 *
 * @example
 * formatBRL(1234.5)    // "R$ 1.234,50"
 * formatBRL(0)         // "R$ 0,00"
 * formatBRL(-567.89)   // "-R$ 567,89"
 */
function formatBRL(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount).replace(/\s/g, " ");
}

/**
 * Parses a BRL-formatted currency string back into a numeric value.
 * The input must start with "R$" or contain only digits, commas, dots, and hyphens.
 *
 * @param formatted - The BRL currency string to parse
 * @returns The parsed numeric value
 * @throws {Error} "Invalid BRL format" if the string is empty, non-numeric, or uses a non-BRL symbol
 *
 * @example
 * parseBRL("R$ 1.234,50")      // 1234.5
 * parseBRL("R$ -567,89")       // -567.89
 * parseBRL("R$ 1.234.567,89")  // 1234567.89
 */
function parseBRL(formatted: string): number {
  const digitsOnly = (formatted || "").trim().replace(/[\D]+/g, "");
  const containsAnyMonetarySymbol = /[^\d\s,.-]/.test(formatted);
  const containsBRL = formatted.trim().startsWith("R$");
  if (digitsOnly.length === 0 || (containsAnyMonetarySymbol && !containsBRL)) {
    throw new Error("Invalid BRL format");
  }

  const numericString = formatted.replace(/[^0-9,-]+/g, "").replace(",", ".");
  return parseFloat(numericString);
}

export { formatBRL, parseBRL };

// Future additions:
// - formatCurrency(amount: number, currency: string, locale?: string): string — generic currency formatter
// - parseCurrency(formatted: string, locale?: string): number — generic currency parser
// - formatBRLCompact(amount: number): string — compact notation (e.g. "R$ 1,2 mi", "R$ 500 mil")
