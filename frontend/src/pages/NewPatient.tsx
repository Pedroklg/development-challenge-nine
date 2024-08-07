import React from 'react';
import PatientForm from '../components/PatientForm';

const NewPatient: React.FC = () => {

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Criar Paciente</h1>
            <PatientForm edit={ false }
            />
        </div>
    );
};

export default NewPatient;
