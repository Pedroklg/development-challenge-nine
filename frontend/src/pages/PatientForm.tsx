import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

interface Patient {
  id?: number;
  name: string;
  birth_date: string;
  email: string;
  address: string;
}

const PatientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>({ name: '', birth_date: '', email: '', address: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== 'new') {
      axios.get(`http://localhost:5000/patients/${id}`)
        .then(response => setPatient(response.data))
        .catch(error => console.error('Error fetching patient data:', error));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientData = {
      id: patient.id ?? undefined,
      name: patient.name,
      birth_date: patient.birth_date,
      email: patient.email,
      address: patient.address,
    };

    if (id && id !== 'new') {
      updatePatient(patientData);
    } else {
      createPatient(patientData);
    }
  };

  async function createPatient(patientData: Patient) {
    try {
      await axios.post('http://localhost:5000/patients', patientData);
      navigate('/patients');
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  async function updatePatient(patientData: Patient) {
    try {
      await axios.put(`http://localhost:5000/patients/${id}`, patientData);
      navigate('/patients');
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{id ? 'Edit Patient' : 'New Patient'}</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={patient.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Birth Date"
          name="birth_date"
          type="date"
          value={patient.birth_date}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={patient.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Address"
          name="address"
          value={patient.address}
          onChange={handleChange}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" className="mt-4">
          {id ? 'Update' : 'Create'}
        </Button>
      </form>
    </div>
  );
};

export default PatientForm;
