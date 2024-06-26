import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import InputMask from 'react-input-mask';
import api from "../api";
import { useEffect, useState } from "react";
import CustomSnackbar from "../components/CustomSnackbar";
import { useParams, useSearchParams } from "react-router-dom";

type Inputs = {
    name: string;
    email: string;
    address: string;
    birth: string;
}

function EditPatient() {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
        reset,
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true)
        if (!isDateValid(data.birth)) {
            setError("birth", {
                message: "Data inválida!",
                type: "pattern"
            })
            return;
        }

        data.birth = formatDateToEN(data.birth);

        try {
            const res = await api.put(`/patient/update/${id}`, data);

            setSnackbar({
                ...snackbar,
                isOpen: true,
                message: "Paciente atualizado com sucesso!",
                severity: 'success'
            })
            setTimeout(() => {
                location.assign("/");
            }, 2000)

        } catch (err) {
            setSnackbar({
                ...snackbar,
                isOpen: true,
                message: "Ocorreu algum erro ao atualizar o paciente.",
                severity: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const formatDateToEN = (date: string) => {
        const dateArr = date.split('/');
        let fDate = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;

        return fDate;
    }

    const isDateValid = (date: string) => {
        if (new Date(formatDateToEN(date)) == "Invalid Date")
            return false;

        return true;

    }

    const [snackbar, setSnackbar] = useState<{
        isOpen: boolean,
        message: string,
        severity: "success" | "error"
    }>({
        isOpen: false,
        message: "",
        severity: "success"
    });

    let { id } = useParams()

    useEffect(() => {
        getPatientInfo()
    }, [])

    const getPatientInfo = async () => {
        const res = await api.get(`/patient/get/${id}`)

        console.log(res.data);

        if (res.status == 200 && res.data.patient.length > 0) {
            const data: Inputs = res.data.patient[0];
            reset({
                name: data.name,
                email: data.email,
                address: data.address,
                birth: new Date(data.birth).toLocaleDateString("pt-BR"),
            })
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>

            <CustomSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />

            <Box sx={{ maxWidth: 350, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" component="h1">
                    Editar Paciente
                </Typography>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 350 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth sx={{ gap: 3 }}>
                        <TextField error={errors.name && true} helperText={errors.name && "Campo nome não pode ser vazio."} label="Nome" variant="outlined" defaultValue=" " {...register("name", {
                            required: true
                        })} />

                        <InputMask
                            mask="99/99/9999"
                            maskChar=""
                            defaultValue="00/00/0000"
                            {...register("birth", {
                                required: true
                            })}

                        >
                            {() => <TextField label="Data de Nascimento" error={errors.birth && true} helperText={errors.birth?.type == "pattern" ? errors.birth.message : errors.birth ? "Campo data de nascimento não pode ser vazio." : ""} name="birth" />}
                        </InputMask>
                        <TextField error={errors.email && true} helperText={errors.email && "Campo email não pode ser vazio."} label="Email" variant="outlined" type="email" defaultValue="email@email.com" {...register("email", {
                            required: true,
                        })} />

                        <TextField error={errors.address && true} helperText={errors.address && "Campo endereço não pode ser vazio."} label="Endereço" variant="outlined" defaultValue=" " {...register("address", {
                            required: true
                        })} />

                        <Button type="submit" variant="contained">{loading ? <CircularProgress size="25px" color="inherit" /> : "Cadastrar"}</Button>
                    </FormControl>
                </form>
            </Box>

        </Box>
    )
}

export default EditPatient;