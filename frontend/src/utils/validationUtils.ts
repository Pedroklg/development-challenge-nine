import { fetchAddressByCep } from './addressUtils';
import Patient from '../types/patientsTypes';

export const validateDate = (birth_date: string) => {
    if (!birth_date || birth_date.length < 10) {
        return 'Data de nascimento inválida';
    }
    
    const date = new Date(birth_date);
    const today = new Date();

    if (date > today) {
        return 'Data de nascimento inválida';
    }

    return;
}

export function validateInput(
  name: string,
  value: string,
  setCepError: React.Dispatch<React.SetStateAction<string | null>>,
  setDataError: React.Dispatch<React.SetStateAction<string | null>>,
  setEmailError: React.Dispatch<React.SetStateAction<string | null>>,
  setNameError: React.Dispatch<React.SetStateAction<string | null>>,
  setFormPatient: React.Dispatch<React.SetStateAction<Patient | null>>
) {
  switch (name) {
    case 'cep':
      if (value.length >= 8) {
        const cepRegex = /^\d{8}$/;
        if (!cepRegex.test(value)) {
          setCepError('O CEP deve conter exatamente 8 números.');
          return;
        }
        setCepError(null);
        fetchAddressByCep(value, setFormPatient);
      }
      break;
    case 'birth_date':
        // if (value.length < 10) {
        //     setDataError('Data de nascimento inválida');
        //     return;
        // }
        
        const date = new Date(value);
        const today = new Date();
    
        if (date > today) {
            return 'Data de nascimento inválida';
        }
        setDataError(null);
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError('Invalid email format');
        return;
      }
      setEmailError(null);
      break;

    case 'name':
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(value)) {
        setNameError('Invalid name format');
        return;
      }
      setNameError(null);
      break;

    default:
      break;
  }
}