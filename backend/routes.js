import { Router } from 'express'
import PatientController from './controllers/PatientController.js';

const routes = Router();

routes.get("/patient/getall", PatientController.getAll)
routes.get("/patient/get/:id", PatientController.getById)
routes.post("/patient/create", PatientController.create)
routes.put("/patient/update/:id", PatientController.update)
routes.delete("/patient/delete/:id", PatientController.delete)

export default routes;