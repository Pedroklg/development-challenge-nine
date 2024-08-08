import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Autocomplete } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Patient from '../types/patientsTypes';
import { useSnackbar } from '../context/SnackbarContext';
import { validateInput } from '../utils/validationUtils';

interface PatientListProps {
    id: number;
    name: string;
}

const PatientForm: React.FC<{ edit: boolean }> = ({ edit }) => {
    const [id, setId] = useState<string | null>(null);
    const [formPatient, setFormPatient] = useState<Patient | null>(null);
    const [patientsList, setPatientsList] = useState<PatientListProps[]>([]);
    const [autocompleteValue, setAutocompleteValue] = useState<PatientListProps | null>(null);
    const [cepError, setCepError] = useState<string | null>(null);
    const [dataError, setDataError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const location = useLocation();
    const { setSnackbar } = useSnackbar();
    const initialPatient: Patient = {
        name: '',
        birth_date: '',
        email: '',
        address: {
            cep: '',
            state: '',
            city: '',
            district: '',
            street: '',
            number: '',
            complement: ''
        }
    };

    const getIdFromQuery = () => {
        const params = new URLSearchParams(location.search);
        return params.get('id');
    };

    useEffect(() => {
        setId(getIdFromQuery());
    }, [location]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:5000/patientsSamples/');
                setPatientsList(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setSnackbar('Erro buscando pacientes', 'error');
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchPatient = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/patients/${id}`);
                    const patientData = response.data;
                    setFormPatient({
                        ...patientData, birth_date: patientData.birth_date.split('T')[0],
                        address: { ...patientData.address, complement: patientData.address.complement || '' }
                    });
                    setAutocompleteValue({ id: patientData.id, name: patientData.name });
                } catch (error) {
                    console.error('Error fetching patient:', error);
                    setSnackbar('Erro buscando pacientes', 'error');
                }
            };

            fetchPatient();
        } else {
            setFormPatient(initialPatient);
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [inputName, inputValue] = [name, value];

        setFormPatient(prevState => {
            if (!prevState) return null;

            if (inputName in prevState.address) {
                return {
                    ...prevState,
                    address: {
                        ...prevState.address,
                        [inputName]: inputValue
                    }
                };
            }

            return {
                ...prevState,
                [inputName]: inputValue
            };
        });

        validateInput(inputName, inputValue, setCepError, setDataError, setEmailError, setNameError, setFormPatient);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cepError || dataError || emailError || nameError) {
            setSnackbar('Preencha os campos corretamente!', 'error');
            return;
        }

        if (formPatient?.birth_date && formPatient.birth_date.length < 10) {
            setDataError('Insira uma data válida!');
            return;
        }

        if (edit && !autocompleteValue) {
            setSnackbar('Selecione um paciente para editar!', 'error');
            return;
        }

        if (!edit) {
            await createPatient(formPatient as Patient);
            return;
        }
        await updatePatient(formPatient as Patient);

    };

    const createPatient = async (patient: Patient) => {
        try {
            await axios.post('http://localhost:5000/patients/', patient);
            setSnackbar('Patient created successfully!', 'success');
            setFormPatient(initialPatient);
            setId(null);
        } catch (error) {
            console.error('Error creating patient:', error);
            setSnackbar('Error creating patient', 'error');
        }
    };

    const updatePatient = async (patient: Patient) => {
        try {
            await axios.put(`http://localhost:5000/patients/${id}`, patient);
            setSnackbar('Patient updated successfully!', 'success');
            setFormPatient(initialPatient);
            setAutocompleteValue(null);
            setId(null);
        } catch (error) {
            console.error('Error updating patient:', error);
            setSnackbar('Error updating patient', 'error');
        }
    };

    const handleAutocompleteChange = (_event: React.ChangeEvent<{}>, value: PatientListProps | null) => {
        if (!value) {
            setAutocompleteValue(null);
            setFormPatient(initialPatient);
            return;
        }

        setId(value.id.toString());
    };

    return (
        <>
            {edit && (
                <Autocomplete
                    value={autocompleteValue}
                    onChange={handleAutocompleteChange}
                    options={patientsList}
                    getOptionLabel={(option) => `${option.id} - ${option.name}`}
                    renderInput={(params) => <TextField {...params} label="Selecione um Paciente" fullWidth />}
                    className='mb-4'
                />
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nome"
                    name="name"
                    value={formPatient?.name || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!nameError}
                    helperText={nameError}
                />
                <TextField
                    label="Data de Nascimento"
                    name="birth_date"
                    type="date"
                    value={formPatient?.birth_date || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={!!dataError}
                    helperText={dataError}
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formPatient?.email || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!emailError}
                    helperText={emailError}
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="CEP(apenas números)"
                            name="cep"
                            value={formPatient?.address?.cep || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!cepError}
                            helperText={cepError}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Estado"
                            name="state"
                            value={formPatient?.address?.state || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Cidade"
                            name="city"
                            value={formPatient?.address?.city || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Bairro"
                            name="district"
                            value={formPatient?.address?.district || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Rua"
                            name="street"
                            value={formPatient?.address?.street || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Número"
                            name="number"
                            value={formPatient?.address?.number || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Complemento"
                            name="complement"
                            value={formPatient?.address?.complement || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" className="mt-4">
                    {edit ? 'Update Patient' : 'Create Patient'}
                </Button>
            </form>
        </>
    );
};

export default PatientForm;