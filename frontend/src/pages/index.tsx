import { useEffect, useState } from "react";
import api from "../api";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { DeleteOutlined, AddCircleOutlined, EditOutlined } from '@mui/icons-material';
import DeleteDialog from "../components/DeleteDialog";
import CustomSnackbar from "../components/CustomSnackbar";

type Patient = {
    _id: string;
    name: string;
    email: string;
    address: string;
    birth: string;
}

function Home() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);

    async function getPatients() {
        setLoading(true)
        const res = await api.get("/patient/getall")

        if (res.status == 200) {
            setPatients(res.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        getPatients()
    }, [])

    const [snackbar, setSnackbar] = useState<{
        isOpen: boolean,
        message: string,
        severity: "success" | "error"
    }>({
        isOpen: false,
        message: "",
        severity: "success"
    });

    const [open, setOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<string>()

    const openDeleteModal = (id: string) => {
        setOpen(true);
        setSelectedPatient(id)
    };

    const closeDeleteModal = () => {
        setOpen(false);
    };

    const deletePatient = async () => {
        if (selectedPatient != undefined) {
            try {
                const res = await api.delete(`/patient/delete/${selectedPatient}`);

                setSnackbar({
                    ...snackbar,
                    isOpen: true,
                    message: "Paciente excluído com sucesso!",
                    severity: 'success'
                })
                setTimeout(() => {
                    location.reload();
                }, 2000)
            } catch (err) {
                setSnackbar({
                    ...snackbar,
                    isOpen: true,
                    message: "Ocorreu algum erro ao excluir o paciente!",
                    severity: 'error'
                })
            } finally {
                closeDeleteModal()
            }
            console.log("Teste")
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <CustomSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
            <DeleteDialog
                open={open}
                handleClose={closeDeleteModal}
                handleAccept={deletePatient}
            />
            <Box sx={{ maxWidth: 750, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" component="h1">
                    Pacientes
                </Typography>
                <Button href="/patient/create">
                    <AddCircleOutlined fontSize="large" />
                </Button>
            </Box>
            <TableContainer sx={{ maxWidth: 750 }} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Data de Nascimento</TableCell>
                            <TableCell>Endereço</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{new Date(row.birth).toLocaleDateString("pt-BR")}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>
                                    <Button onClick={() => openDeleteModal(row._id)} style={{ minWidth: '24px', padding: '0' }}>
                                        <DeleteOutlined color="error" />
                                    </Button>
                                    <Button href={`/patient/edit/${row._id}`} style={{ minWidth: '24px', padding: '0' }}>
                                        <EditOutlined color="action" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {loading && <CircularProgress />}

        </Box>
    )
}

export default Home;