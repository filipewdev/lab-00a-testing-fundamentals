interface CEPResult {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
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
