interface Address {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
  }
  
  interface Patient {
    id: number;
    name: string;
    birth_date: string;
    email: string;
    address_id: number;
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
  }

  interface PatientFormProps {
    id?: string;
    name: string;
    birth_date: string;
    email: string;
    address: Address;
  }

  export default Patient;
  export type { Address, PatientFormProps };