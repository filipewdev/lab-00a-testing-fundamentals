function validateCPF(cpf: string): boolean {
  const cleanDocument = (cpf || "").trim().replace(/\D/g, "");
  const validLength = cleanDocument.length === 11;
  const allDigitsSame = /^(\d)\1{10}$/.test(cleanDocument);

  if (!validLength || allDigitsSame) return false;

  const documentAsNumbers = cleanDocument.split("").map(Number);

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
  const rawCPF = unformatCPF(cpf);
  const validCPF = validateCPF(rawCPF);

  if (!rawCPF || !validCPF) return "";

  return rawCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function unformatCPF(cpf: string): string {
  const rawCPF = (cpf || "").trim().replace(/\D/g, "");
  const validCPF = validateCPF(rawCPF);

  if (!rawCPF || !validCPF) return "";

  return rawCPF;
}

export { validateCPF, formatCPF, unformatCPF };