import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home';
import PatientList from './pages/PatientList';
import EditPatient from './pages/EditPatient';
import NewPatient from './pages/NewPatient';
import PageNotFound from './pages/PageNotFound';
import Aside from './components/Aside';
import theme from './theme';
import './index.css';
import { SnackbarProvider } from './context/SnackbarContext';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Router>
          <div className="flex">
            <Aside />
            <main className="flex-grow md:p-6 mt-14 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/patients" element={<PatientList />} />
                <Route path="/patients/new" element={<NewPatient />} />
                <Route path="/patients/edit" element={<EditPatient />} />
                <Route path='/*' element={<PageNotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
