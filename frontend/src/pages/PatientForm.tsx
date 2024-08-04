import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid } from '@mui/material';
import { PatientFormProps } from '../types/patientsTypes';

const PatientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientFormProps>({
    id: undefined,
    name: '',
    birth_date: '',
    email: '',
    address: {
      cep: '',
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      complemento: ''
    }
  });

  const [cepError, setCepError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/patients/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };
    
    if (id && id !== 'new') {
      fetchPatient();
    }

  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient(prevState => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value
      }
    }));

    if (name === 'cep' && value.length === 8) {
      fetchAddressByCep(value);
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;
      setPatient(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          estado: data.uf,
          cidade: data.localidade,
          bairro: data.bairro,
          rua: data.logradouro
        }
      }));
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{8}$/.test(patient.address.cep)) {
      setCepError('O CEP deve conter exatamente 8 números.');
      return;
    } else {
      setCepError(null);
    }

    const patientData = {
      id: patient.id,
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

  async function createPatient(patientData: PatientFormProps) {
    try {
      await axios.post('http://localhost:5000/patients', patientData);
      navigate('/patients');
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  async function updatePatient(patientData: PatientFormProps) {
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="CEP (apenas números)"
              name="cep"
              value={patient.address.cep}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!cepError}
              helperText={cepError}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Estado"
              name="estado"
              value={patient.address.estado}
              onChange={handleAddressChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Cidade"
              name="cidade"
              value={patient.address.cidade}
              onChange={handleAddressChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Bairro"
              name="bairro"
              value={patient.address.bairro}
              onChange={handleAddressChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Rua"
              name="rua"
              value={patient.address.rua}
              onChange={handleAddressChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Número"
              name="numero"
              value={patient.address.numero}
              onChange={handleAddressChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <TextField
          label="Complemento (opcional)"
          name="complemento"
          value={patient.address.complemento}
          onChange={handleAddressChange}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" className="mt-4">
          {id ? 'Update' : 'Create'}
        </Button>
      </form>
    </div>
  );
};

export default PatientForm;
