function formatBRL(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount).replace(/\s/g, " ");
}

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
