/**
 * Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica) using the
 * official Receita Federal weighted check digit algorithm.
 *
 * Accepts both formatted ("11.222.333/0001-81") and unformatted ("11222333000181")
 * inputs. Non-digit characters are stripped before validation. CNPJs with all
 * identical digits are rejected.
 *
 * @param cnpj - The CNPJ string to validate
 * @returns `true` if the CNPJ is valid, `false` otherwise
 *
 * @example
 * validateCNPJ("11222333000181")        // true
 * validateCNPJ("11.222.333/0001-81")    // true
 * validateCNPJ("11111111111111")        // false (all same digits)
 */
function validateCNPJ(cnpj: string): boolean {
  const digitsOnly = (cnpj || "").trim().replace(/\D/g, "");
  const isAllSameDigits = /^(\d)\1{13}$/.test(digitsOnly);
  const isValidLength = digitsOnly.length === 14;
  if (isAllSameDigits || !isValidLength) return false;

  const documentAsNumbers = digitsOnly.split("").map(Number);

  const calculateCheckDigit = (
    baseDigits: number[],
    weights: number[],
  ): number => {
    const sum = baseDigits.reduce(
      (acc, digit, index) => acc + digit * (weights?.[index] || 1),
      0,
    );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstCheckDigit = calculateCheckDigit(
    documentAsNumbers.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );
  if (firstCheckDigit !== documentAsNumbers[12]) return false;

  const secondCheckDigit = calculateCheckDigit(
    documentAsNumbers.slice(0, 13),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );
  if (secondCheckDigit !== documentAsNumbers[13]) return false;

  return true;
}

/**
 * Formats a valid CNPJ string into the standard "XX.XXX.XXX/XXXX-XX" pattern.
 * Returns an empty string if the CNPJ is invalid.
 *
 * @param cnpj - The CNPJ string to format
 * @returns The formatted CNPJ, or `""` if invalid
 *
 * @example
 * formatCNPJ("11222333000181")       // "11.222.333/0001-81"
 * formatCNPJ("11.222.333/0001-81")   // "11.222.333/0001-81"
 * formatCNPJ("00000000000000")       // ""
 */
function formatCNPJ(cnpj: string): string {
  const digitsOnly = (cnpj || "").trim().replace(/\D/g, "");
  const isCNPJValid = validateCNPJ(cnpj);
  if (!digitsOnly || !isCNPJValid) return "";

  return digitsOnly.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
}

/**
 * Removes formatting from a valid CNPJ, returning only its 14 digits.
 * Returns an empty string if the CNPJ is invalid.
 *
 * @param cnpj - The CNPJ string to unformat
 * @returns The unformatted CNPJ (digits only), or `""` if invalid
 *
 * @example
 * unformatCNPJ("11.222.333/0001-81")  // "11222333000181"
 * unformatCNPJ("invalid")             // ""
 */
function unformatCNPJ(cnpj: string): string {
  const digitsOnly = (cnpj || "").trim().replace(/\D/g, "");
  const isCNPJValid = validateCNPJ(cnpj);
  if (!digitsOnly || !isCNPJValid) return "";

  return digitsOnly;
}

export { validateCNPJ, formatCNPJ, unformatCNPJ };

// Future additions:
// - generateCNPJ(): string — generate a random valid CNPJ (useful for testing/seeding)
// - maskCNPJ(cnpj: string): string — partially mask a CNPJ for display (e.g. "11.222.***/****-81")
// - getCNPJBranch(cnpj: string): string — extract the branch/filial number (digits 9-12)
