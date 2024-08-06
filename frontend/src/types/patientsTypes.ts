interface Patient {
  id?: string;
  name: string;
  birth_date: string;
  email: string;
  address: Address;
}

interface Address {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
}

export default Patient;
export type { Address };