import './App.css';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import PatienstForm from './pages/PatientsForm';
import Patients from './pages/Patients';

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className='ml-32'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patientForm" element={<PatienstForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
