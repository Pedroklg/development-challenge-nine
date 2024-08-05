import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home';
import PatientList from './pages/PatientList';
import EditPatient from './pages/EditPatient';
import NewPatient from './pages/NewPatient';
import Aside from './components/Aside';
import theme from './theme';
import './index.css';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="flex">
          <Aside />
          <main className="flex-grow p-6 mt-14">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/new" element={<NewPatient />} />
              <Route path="/patients/edit" element={<EditPatient />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;