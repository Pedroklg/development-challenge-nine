import React from 'react';
import PatientForm from '../components/PatientForm';

const EditPatient: React.FC = () => {

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Editar Paciente</h1>
            <PatientForm edit={ true }/>
        </div>
    );
};

export default EditPatient;
