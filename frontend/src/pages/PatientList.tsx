import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Patient from '../types/patientsTypes';
import { useSnackbar } from '../context/SnackbarContext';
import { useMediaQuery, useTheme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientDialog from '../components/PatientDialog';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'details' | 'delete' | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();
  const { setSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchPatients = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/patients?limit=${rowsPerPage}&offset=${page * rowsPerPage}`);
            setPatients(response.data.patients);
            setTotalPatients(response.data.total);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setSnackbar('Erro ao buscar pacientes', 'error');
        }
    };

    fetchPatients();
}, [setSnackbar, rowsPerPage, page]);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDetailsClick = (id: string) => {
    const patient = patients.find(patient => patient.id === id);
    if (patient) {
      setSelectedPatient(patient);
      setDialogType('details');
      setOpen(true);
    }
  };

  const handleEditClick = (id: string) => {
    navigate(`/patients/edit?id=${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedPatientId(id);
    setDialogType('delete');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatientId(null);
    setSelectedPatient(null);
    setDialogType(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedPatientId !== null) {
      try {
        await axios.delete(`http://localhost:5000/patients/${selectedPatientId}`);
        setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== String(selectedPatientId)));
        setSnackbar('Paciente deletado com sucesso', 'success');
      } catch (error) {
        console.error('Error deleting patient:', error);
        setSnackbar('Erro ao excluir paciente', 'error');
      } finally {
        handleClose();
      }
    }
  };

  return (
    <div className="p-6 overflow-auto">
      <h1 className="text-2xl font-bold">Lista de Pacientes</h1>
      <TableContainer component={Paper} className="my-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="bg-gray-200 w-1/12">ID</TableCell>
              <TableCell className="bg-gray-200 w-2/12">Nome</TableCell>
              <TableCell className="bg-gray-200 w-1/12">{isMobile ? 'Ano' : 'Data Nasc.'}</TableCell>
              {!isMobile && <TableCell className="bg-gray-200 w-2/12">Email</TableCell>}
              <TableCell className="bg-gray-200 w-1/12">Estado</TableCell>
              <TableCell className="bg-gray-200 w-1/12">Cidade</TableCell>
              <TableCell className="bg-gray-200 w-2/12">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{isMobile ? new Date(patient.birth_date).getFullYear() : new Date(patient.birth_date).toLocaleDateString()}</TableCell>
                {!isMobile && <TableCell>{patient.email}</TableCell>}
                <TableCell>{patient.address.state}</TableCell>
                <TableCell>{patient.address.city}</TableCell>
                <TableCell>
                  <IconButton  title='Detalhes' color="info" onClick={() => handleDetailsClick(patient.id ?? '')}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton title='Editar' color="primary" onClick={() => handleEditClick(patient.id ?? '')}>
                    <EditIcon />
                  </IconButton>
                  <IconButton title='Excluir' color="error" onClick={() => handleDeleteClick(patient.id ?? '')}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={totalPatients}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <PatientDialog
        open={open}
        onClose={handleClose}
        dialogType={dialogType}
        selectedPatient={selectedPatient}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default PatientList;
