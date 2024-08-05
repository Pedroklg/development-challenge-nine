import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Autocomplete, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { PatientFormProps } from '../types/patientsTypes';

interface PatientFormPropsComponent {
    edit: boolean;
}

interface PatientListProps {
    id: number;
    name: string;
}

const PatientForm: React.FC<PatientFormPropsComponent> = ({ edit }) => {
    const [formPatient, setFormPatient] = useState<PatientFormProps | null>(null);
    const [patientsList, setPatientsList] = useState<PatientListProps[]>([]);
    const [autocompleteValue, setAutocompleteValue] = useState<PatientListProps | null>(null);
    const [cepError, setCepError] = useState<string | null>(null);
    const [dataError, setDataError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
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

    const [id, setId] = useState<string | null>(getIdFromQuery());

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/patients/');
                const transformedPatients = response.data.map((patient: any) => ({
                    id: patient.id,
                    name: patient.name
                }));
                setPatientsList(transformedPatients);
            } catch (error) {
                console.error('Error fetching patients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchPatient = async () => {
                setLoading(true);
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
                } finally {
                    setLoading(false);
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

        if (name === 'cep') {
            const formattedValue = value.replace('-', '');
            const cepRegex = /^\d{8}$/;
            if (!cepRegex.test(formattedValue)) {
                setCepError('O CEP deve conter exatamente 8 números.');
            } else {
                setCepError(null);
                if (formattedValue.length === 8) {
                    fetchAddressByCep(formattedValue);
                }
            }
        }
    };

    const fetchAddressByCep = async (cep: string) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;
            setFormPatient(prevState => {
                if (!prevState) return null;

                return {
                    ...prevState,
                    address: {
                        ...prevState.address,
                        cep: data.cep.replace('-', ''),
                        estado: data.uf,
                        cidade: data.localidade,
                        bairro: data.bairro,
                        rua: data.logradouro,
                        numero: '',
                        complemento: ''
                    }
                };
            });
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateDate();

        if (formPatient && (cepError || dataError)) {
            return;
        }

        if (edit && !autocompleteValue) {
            alert('Select a patient to edit');
            return;
        }

        if (edit && formPatient) {
            updatePatient(formPatient);
        } else if (formPatient) {
            createPatient(formPatient);
        }
    };

    const createPatient = async (patient: PatientFormProps) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/patients/', patient);
            setFormPatient(initialPatient);
            alert('Patient created successfully!');
            navigate('/patients');
        } catch (error) {
            console.error('Error creating patient:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePatient = async (patient: PatientFormProps) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/patients/${id}`, patient);
            alert('Patient updated successfully!');
            setFormPatient(initialPatient);
            navigate('/patients');
        } catch (error) {
            console.error('Error updating patient:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAutocompleteChange = (_event: React.ChangeEvent<{}>, value: PatientListProps | null) => {
        if (value) {
            setId(value.id.toString());
        } else {
            setAutocompleteValue(null);
            setFormPatient(null);
        }
    };

    const validateDate = () => {
        if (formPatient?.birth_date) {
            const date = new Date(formPatient.birth_date);
            const today = new Date();

            if (date > today) {
                setDataError('Birth Date must be in the past');
                return;
            }
        }
        if (formPatient?.birth_date.length !== 10) {
            setDataError('Birth Date must have 10 characters');
            return;
        }
        setDataError(null);
    };

    if (loading) {
        return <CircularProgress />;
    }

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