import { fetchAddressByCep } from './addressUtils';
import Patient from '../types/patientsTypes';

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
        if (!fetchAddressByCep(value, setFormPatient)){
          setCepError('CEP não encontrado');
        }

      }
      break;

    case 'birth_date':
      if (value.length >= 10) {
        const date = new Date(value);
        const today = new Date();

        if (date > today) {
          setDataError('Data de nascimento inválida');
          return;
        }
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