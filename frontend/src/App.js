import './App.css';
import { Routers, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PatientForm } from './pages/PatientForm';
import { PatientList } from './pages/PatientList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routers>
          <Route path="/" component={Home} />
          <Route path="/patient-form" component={PatientForm} />
          <Route path="/patient-list" component={PatientList} />
        </Routers>
      </header>
    </div>
  );
}

export default App;
