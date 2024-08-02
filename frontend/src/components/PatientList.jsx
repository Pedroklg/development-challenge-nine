// src/components/PatientList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // axios.get('http://localhost:5000/api/patients')
    //   .then(response => setPatients(response.data))
    //   .catch(error => console.error('Error fetching data:', error));

    setPatients([
      {
        id: 1,
        name: 'John Doe',
        birth_date: '1990-01-01',
        email: 'klgarpema@gmail.com',
        address: '123 Main St, Springfield, IL 62701',
      },
      {
        id: 2,
        name: 'Jane Smith',
        birth_date: '1995-05-05',
        email: 'klgarpema@gmail.com',
        address: '456 Elm St, Springfield, IL 62702',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        birth_date: '1985-10-10',
        email: 'klgarpema@gmail.com',
        address: '789 Oak St, Springfield, IL 62703',
      },
    ]);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (id) => {
    navigate(`/patients/${id}`);
  };

  const handleDeleteClick = (id) => {
    // axios.delete(`http://localhost:5000/api/patients/${id}`)
    //   .then(() => setPatients(patients.filter(patient => patient.id !== id)))
    //   .catch(error => console.error('Error deleting patient:', error));

    setPatients(patients.filter(patient => patient.id !== id));
  };

  const displayedPatients = patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6">
      <div className='flex gap-10'>
        <h1 className="text-2xl font-bold">Patient List</h1>
        <Button variant="contained" color="primary" onClick={() => navigate(`/patientsForm`)}>
          Add Patient
        </Button>
      </div>
      <TableContainer component={Paper} className="my-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="bg-gray-200">Name</TableCell>
              <TableCell className="bg-gray-200">Birth Date</TableCell>
              <TableCell className="bg-gray-200">Email</TableCell>
              <TableCell className="bg-gray-200">Address</TableCell>
              <TableCell className="bg-gray-200">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{new Date(patient.birth_date).toLocaleDateString()}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.address}</TableCell>
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
        rowsPerPageOptions={[5, 10, 25]}
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