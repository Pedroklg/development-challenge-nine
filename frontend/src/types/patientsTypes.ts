interface Patient {
  id?: string;
  name: string;
  birth_date: string;
  email: string;
  address: Address;
}

interface Address {
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  complement?: string;
}

export default Patient;
export type { Address };