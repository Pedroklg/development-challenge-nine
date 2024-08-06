import { Router } from "express";
import { getPatientsSamples, getPatients, getPatientById, createPatient, updatePatient, deletePatient } from "../controllers/patientController.js";

const router = Router();

router.get("/patients", getPatients);
router.get("/patients/:id", getPatientById);
router.get("/patientsSamples", getPatientsSamples);
router.post("/patients", createPatient);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatient);

export default router;