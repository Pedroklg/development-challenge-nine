import db from '../db/db.js';
import { patientPostSchema, patientUpdateSchema } from '../models/patient.js';

export const getPatients = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM patients');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error getting patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
        if (patient.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient.rows[0]);
    } catch {
        console.error('Error getting patient by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createPatient = async (req, res) => {
    const { error, value } = patientPostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, birthDate, email, address } = value;
    try {
        const patient = await db.query(
            'INSERT INTO patients (name, birth_date, email, address) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, birthDate, email, address]
        );
        res.status(201).json(patient.rows[0]);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { error, value } = patientUpdateSchema.validate({ id, ...req.body });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, birthDate, email, address } = value;
    if (!name && !birthDate && !email && !address) {
        return res.status(400).json({ error: 'At least one field must be updated' });
    }

    try {
        const patient = await db.query(
            'UPDATE patients SET name = $1, birth_date = $2, email = $3, address = $4 WHERE id = $5 RETURNING *',
            [name, birthDate, email, address, id]
        );
        if (patient.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient.rows[0]);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await db.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);
        if (patient.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted successfully' }, patient.rows[0]);
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}