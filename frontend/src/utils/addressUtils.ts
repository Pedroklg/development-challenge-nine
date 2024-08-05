import axios from 'axios';
import { PatientFormProps } from '../types/patientsTypes';

export const fetchAddressByCep = async (cep: string, setFormPatient: React.Dispatch<React.SetStateAction<PatientFormProps | null>>) => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;
        if (data.erro) {
            console.error('CEP not found');
            return false;
        }
        setFormPatient((prevState: PatientFormProps | null) => {
            if (!prevState) return null;

            return {
                ...prevState,
                address: {
                    ...prevState.address,
                    cep: data.cep.replace('-', ''),
                    estado: data.uf,
                    cidade: data.localidade,
                    bairro: data.bairro,
                    rua: data.logradouro,
                    numero: '',
                    complemento: ''
                }
            };
        });
    } catch (error) {
        console.error('Error fetching address:', error);
    }
};