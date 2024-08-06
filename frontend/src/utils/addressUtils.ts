import axios from 'axios';
import Patient from '../types/patientsTypes';

export const fetchAddressByCep = async (cep: string, setFormPatient: React.Dispatch<React.SetStateAction<Patient | null>>) => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;
        if (data.erro) {
            console.error('CEP not found');
            return false;
        }
        setFormPatient((prevState: Patient | null) => {
            if (!prevState) return null;

            return {
                ...prevState,
                address: {
                    ...prevState.address,
                    cep: data.cep.replace('-', ''),
                    state: data.uf,
                    city: data.localidade,
                    district: data.bairro,
                    street: data.logradouro,
                    number: '',
                    complement: ''
                }
            };
        });
    } catch (error) {
        console.error('Error fetching address:', error);
    }
};