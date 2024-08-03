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
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient>({ name: '', birth_date: '', email: '', address: '' });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/patients/${id}`)
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
    if (id) {
      axios.put(`http://localhost:5000/api/patients/${id}`, patient)
        .then(() => navigate('/patients'))
        .catch(error => console.error('Error updating patient:', error));
    } else {
      axios.post('http://localhost:5000/api/patients', patient)
        .then(() => navigate('/patients'))
        .catch(error => console.error('Error creating patient:', error));
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
