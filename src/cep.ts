interface CEPResult {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

function validateCEP(cep: string): boolean {
  const digitsOnly = (cep || "").trim().replace(/\D/g, "");
  return digitsOnly.length === 8;
}

function formatCEP(cep: string): string {
  const isCEPValid = validateCEP(cep);
  if (!isCEPValid) return "";

  const digitsOnly = (cep || "").trim().replace(/\D/g, "");
  return digitsOnly.replace(/(\d{5})(\d{3})/, "$1-$2");
}

function unformatCEP(cep: string): string {
  const isCEPValid = validateCEP(cep);
  if (!isCEPValid) return "";

  const digitsOnly = (cep || "").trim().replace(/\D/g, "");
  return digitsOnly;
}

function lookupCEP(cep: string): Promise<CEPResult> {
  return Promise.resolve({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
  });
}

export { validateCEP, formatCEP, unformatCEP, lookupCEP, CEPResult };
