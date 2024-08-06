import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Autocomplete } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { PatientFormProps } from '../types/patientsTypes';
import { fetchAddressByCep } from '../utils/addressUtils';
import { validateDate } from '../utils/validationUtils';
import { useSnackbar } from '../context/SnackbarContext';

interface PatientListProps {
    id: number;
    name: string;
}

const PatientForm: React.FC<{ edit: boolean }> = ({ edit }) => {
    const [id, setId] = useState<string | null>(null);
    const [formPatient, setFormPatient] = useState<PatientFormProps | null>(null);
    const [patientsList, setPatientsList] = useState<PatientListProps[]>([]);
    const [autocompleteValue, setAutocompleteValue] = useState<PatientListProps | null>(null);
    const [cepError, setCepError] = useState<string | null>(null);
    const [dataError, setDataError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { setSnackbar } = useSnackbar(); 
    const initialPatient: PatientFormProps = {
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
                const response = await axios.get('http://localhost:5000/patients/');
                const transformedPatients = response.data.map((patient: any) => ({
                    id: patient.id,
                    name: patient.name
                }));
                setPatientsList(transformedPatients);
            } catch (error) {
                console.error('Error fetching patients:', error);
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

                    const transformedPatient: PatientFormProps = {
                        name: patientData.name,
                        birth_date: patientData.birth_date.split('T')[0],
                        email: patientData.email,
                        address: {
                            cep: patientData.cep,
                            estado: patientData.estado,
                            cidade: patientData.cidade,
                            bairro: patientData.bairro,
                            rua: patientData.rua,
                            numero: patientData.numero,
                            complemento: patientData.complemento || ''
                        }
                    };

                    setFormPatient(transformedPatient);
                    setAutocompleteValue({ id: patientData.id, name: patientData.name });
                } catch (error) {
                    console.error('Error fetching patient:', error);
                    setSnackbar('Error fetching patient', 'error');
                }
            };

            fetchPatient();
        } else {
            setFormPatient(initialPatient);
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormPatient(prevState => {
            if (!prevState) return null;

            if (name in prevState.address) {
                return {
                    ...prevState,
                    address: {
                        ...prevState.address,
                        [name]: value
                    }
                };
            }

            return {
                ...prevState,
                [name]: value
            };
        });

        if (name === 'cep' && value.length >= 8) {
            const formattedValue = value.replace('-', '');
            const cepRegex = /^\d{8}$/;
            if (!cepRegex.test(formattedValue)) {
                setCepError('O CEP deve conter exatamente 8 números.');
                return;
            }
            setCepError(null);
            fetchAddressByCep(formattedValue, setFormPatient);
        }

        if (name === 'birth_date' && value.length >= 10) {
            setDataError(validateDate(value) || null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDataError(await validateDate(formPatient?.birth_date || '') || null);

        if (cepError || dataError) {
            return;
        }

        if (edit && !autocompleteValue) {
            setSnackbar('Please select a patient to edit', 'error');
            return;
        }

        if (edit) {
            await updatePatient(formPatient as PatientFormProps);
        } else {
            await createPatient(formPatient as PatientFormProps);
        }
    };

    const createPatient = async (patient: PatientFormProps) => {
        try {
            await axios.post('http://localhost:5000/patients/', patient);
            setFormPatient(initialPatient);
            setSnackbar('Patient created successfully!', 'success');
            navigate('/patients');
        } catch (error) {
            console.error('Error creating patient:', error);
            setSnackbar('Error creating patient', 'error');
        }
    };

    const updatePatient = async (patient: PatientFormProps) => {
        try {
            await axios.put(`http://localhost:5000/patients/${id}`, patient);
            setSnackbar('Patient updated successfully!', 'success');
            setFormPatient(initialPatient);
            navigate('/patients');
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
        <div className="p-6">
            {edit && (
                <Autocomplete
                    value={autocompleteValue}
                    onChange={handleAutocompleteChange}
                    options={patientsList}
                    getOptionLabel={(option) => `${option.id} - ${option.name}`}
                    renderInput={(params) => <TextField {...params} label="Select Patient" fullWidth />}
                    className='mb-4'
                />
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={formPatient?.name || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Birth Date"
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
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="CEP"
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
                            name="estado"
                            value={formPatient?.address?.estado || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Cidade"
                            name="cidade"
                            value={formPatient?.address?.cidade || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Bairro"
                            name="bairro"
                            value={formPatient?.address?.bairro || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Rua"
                            name="rua"
                            value={formPatient?.address?.rua || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Número"
                            name="numero"
                            value={formPatient?.address?.numero || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Complemento"
                            name="complemento"
                            value={formPatient?.address?.complemento || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" className="mt-4">
                    {edit ? 'Update Patient' : 'Create Patient'}
                </Button>
            </form>
        </div>
    );
};

export default PatientForm;