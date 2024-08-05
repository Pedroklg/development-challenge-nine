import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Patient from '../types/patientsTypes';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (id: number) => {
    navigate(`/patients/edit?id=${id}`);
  };

  const handleDeleteClick = async (id: number) => {
    alert('Are you sure you want to delete this patient?');
    try {
      await axios.delete(`http://localhost:5000/patients/${id}`);
      setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  }

  const displayedPatients = patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6 overflow-auto">
      <h1 className="text-2xl font-bold">Patient List</h1>
      <TableContainer component={Paper} className="my-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="bg-gray-200 w-1/12">ID</TableCell>
              <TableCell className="bg-gray-200 w-2/12">Name</TableCell>
              <TableCell className="bg-gray-200 w-1/12">Birth Date</TableCell>
              <TableCell className="bg-gray-200 w-2/12">Email</TableCell>
              <TableCell className="bg-gray-200 w-1/12">Estado</TableCell>
              <TableCell className="bg-gray-200 w-1/12">Cidade</TableCell>
              <TableCell className="bg-gray-200 w-2/12">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{new Date(patient.birth_date).toLocaleDateString()}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.estado}</TableCell>
                <TableCell>{patient.cidade}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditClick(patient.id)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(patient.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={patients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default PatientList;