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
        const cepRegex = /^\d{8}$/;
        if (!cepRegex.test(value)) {
          setCepError('O CEP deve conter exatamente 8 números.');
          return;
        }
        setCepError(null);
        if (!fetchAddressByCep(value, setFormPatient)) {
          setCepError('CEP não encontrado');
        }
      break;

    case 'birth_date':
      if (value.length < 10) {
        return;
      }

      const date = new Date(value);
      const today = new Date();

      if (date > today) {
        setDataError('Data de nascimento não pode ser no futuro!');
        return;
      }

      if (date.getFullYear() < 1850) {
        setDataError('Data de nascimento não pode ser antes de 1850!')
        return;
      }
      setDataError(null);
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError('Formato de email inválido');
        return;
      }
      setEmailError(null);
      break;

    case 'name':
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(value)) {
        setNameError('Nome inválido');
        return;
      }
      setNameError(null);
      break;

    default:
      break;
  }
}