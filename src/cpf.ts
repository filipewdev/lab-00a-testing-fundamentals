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

function formatCPF(cpf: string): string {
  const digitsOnly = unformatCPF(cpf);
  const validCPF = validateCPF(digitsOnly);

  if (!digitsOnly || !validCPF) return "";

  return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function unformatCPF(cpf: string): string {
  const digitsOnly = (cpf || "").trim().replace(/\D/g, "");
  const validCPF = validateCPF(digitsOnly);

  if (!digitsOnly || !validCPF) return "";

  return digitsOnly;
}

export { validateCPF, formatCPF, unformatCPF };
