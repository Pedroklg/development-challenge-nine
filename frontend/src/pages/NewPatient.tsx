import React from 'react';
import PatientForm from '../components/PatientForm';

const NewPatient: React.FC = () => {

    return (
        <>
            <h1 className="text-2xl font-bold">Criar Paciente</h1>
            <PatientForm edit={ false }
            />
        </>
    );
};

export default NewPatient;
