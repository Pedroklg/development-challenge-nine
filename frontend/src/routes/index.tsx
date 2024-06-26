import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages';
import CreatePatient from '../pages/createPatient';
import EditPatient from '../pages/editPatient';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/patient/create",
        element: <CreatePatient />
    },
    {
        path: "/patient/edit/:id",
        element: <EditPatient />
    },
])

export default router;