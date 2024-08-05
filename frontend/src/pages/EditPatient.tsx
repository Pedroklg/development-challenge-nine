import React from 'react';
import PatientForm from '../components/PatientForm';

const EditPatient: React.FC = () => {

    return (
        <>
            <h1 className="text-2xl font-bold">Create Patient</h1>
            <PatientForm edit={ true }/>
        </>
    );
};

export default EditPatient;
