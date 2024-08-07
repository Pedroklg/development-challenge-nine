import React from 'react';
import PatientForm from '../components/PatientForm';

const EditPatient: React.FC = () => {

    return (
        <>
            <h1 className="text-2xl font-bold pl-3 pt-3">Editar Paciente</h1>
            <PatientForm edit={ true }/>
        </>
    );
};

export default EditPatient;
