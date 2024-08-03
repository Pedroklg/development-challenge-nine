import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home';
import PatientList from './pages/PatientList';
import PatientForm from './pages/PatientForm';
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
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/:id" element={<PatientForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
