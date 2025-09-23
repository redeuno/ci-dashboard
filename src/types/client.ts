
export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address?: string;
  cpfCnpj: string | null;
  asaasCustomerId: string | null;
  payments?: any;
  status: 'Active' | 'Inactive';
  notes?: string;
  lastContact: string;
  creci?: string | null;
  cep?: string | null;
  cidade?: string | null;
  sessionid?: string | null;
  instancia?: string | null;
}
