interface CEPResult {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

function formatCEP(cep: string): string {
  return "";
}

function unformatCEP(cep: string): string {
  return "";
}

function lookupCEP(cep: string): Promise<CEPResult> {
  return Promise.resolve({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
  });
}

export { formatCEP, unformatCEP, lookupCEP, CEPResult };
