/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas) using the official
 * Receita Federal check digit algorithm.
 *
 * Accepts both formatted ("123.456.789-09") and unformatted ("12345678909") inputs.
 * Non-digit characters are stripped before validation. CPFs with all identical
 * digits (e.g. "111.111.111-11") are rejected per Receita Federal rules, even
 * though they pass the mathematical check.
 *
 * @param cpf - The CPF string to validate
 * @returns `true` if the CPF is valid, `false` otherwise
 *
 * @example
 * validateCPF("12345678909")     // true
 * validateCPF("123.456.789-09")  // true
 * validateCPF("11111111111")     // false (all same digits)
 * validateCPF("12345678900")     // false (wrong check digits)
 */
function validateCPF(cpf: string): boolean {
  const digitsOnly = (cpf || "").trim().replace(/\D/g, "");
  const isValidLength = digitsOnly.length === 11;
  const isAllDigitsSame = /^(\d)\1{10}$/.test(digitsOnly);

  if (!isValidLength || isAllDigitsSame) return false;

  const documentAsNumbers = digitsOnly.split("").map(Number);

  const calculateCheckDigit = (factor: number): number => {
    const totalSum = documentAsNumbers
      .slice(0, factor - 1)
      .reduce((sum, digit, index) => sum + digit * (factor - index), 0);

    const remainder = totalSum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstCheckDigit = calculateCheckDigit(10);
  if (firstCheckDigit !== documentAsNumbers[9]) return false;

  const secondCheckDigit = calculateCheckDigit(11);
  if (secondCheckDigit !== documentAsNumbers[10]) return false;

  return true;
}

/**
 * Formats a valid CPF string into the standard "XXX.XXX.XXX-XX" pattern.
 * Returns an empty string if the CPF is invalid.
 *
 * @param cpf - The CPF string to format (formatted or unformatted)
 * @returns The formatted CPF, or `""` if invalid
 *
 * @example
 * formatCPF("12345678909")     // "123.456.789-09"
 * formatCPF("123.456.789-09")  // "123.456.789-09"
 * formatCPF("00000000000")     // ""
 */
function formatCPF(cpf: string): string {
  const digitsOnly = unformatCPF(cpf);
  const validCPF = validateCPF(digitsOnly);

  if (!digitsOnly || !validCPF) return "";

  return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Removes formatting from a valid CPF, returning only its 11 digits.
 * Returns an empty string if the CPF is invalid.
 *
 * @param cpf - The CPF string to unformat
 * @returns The unformatted CPF (digits only), or `""` if invalid
 *
 * @example
 * unformatCPF("123.456.789-09")  // "12345678909"
 * unformatCPF("12345678909")     // "12345678909"
 * unformatCPF("invalid")         // ""
 */
function unformatCPF(cpf: string): string {
  const digitsOnly = (cpf || "").trim().replace(/\D/g, "");
  const validCPF = validateCPF(digitsOnly);

  if (!digitsOnly || !validCPF) return "";

  return digitsOnly;
}

export { validateCPF, formatCPF, unformatCPF };

// Future additions:
// - generateCPF(): string — generate a random valid CPF (useful for testing/seeding)
// - maskCPF(cpf: string): string — partially mask a CPF for display (e.g. "123.***.***-09")
