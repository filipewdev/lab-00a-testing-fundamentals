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

function formatCNPJ(cnpj: string): string {
  const digitsOnly = (cnpj || "").trim().replace(/\D/g, "");
  const isCNPJValid = validateCNPJ(cnpj);
  if (!digitsOnly || !isCNPJValid) return "";

  return digitsOnly.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
}

function unformatCNPJ(cnpj: string): string {
  const digitsOnly = (cnpj || "").trim().replace(/\D/g, "");
  const isCNPJValid = validateCNPJ(cnpj);
  if (!digitsOnly || !isCNPJValid) return "";

  return digitsOnly;
}

export { validateCNPJ, formatCNPJ, unformatCNPJ };
