import { PatientFormProps } from '../types/patientsTypes';

export const validateDate = (formPatient: PatientFormProps | null) => {
    if (formPatient?.birth_date) {
        const date = new Date(formPatient.birth_date);
        const today = new Date();

        if (date > today) {
            return 'Data de nascimento inválida';
        }

        return;
    }
};
