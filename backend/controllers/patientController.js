import db from '../db/db.js';
import patientModel from '../models/patientModel.js';

const findAddress = async (address) => {
    const { cep, estado, cidade, bairro, rua, numero, complemento } = address;

    try {
        const result = await db.query(
            'SELECT id FROM addresses WHERE cep = $1 AND estado = $2 AND cidade = $3 AND bairro = $4 AND rua = $5 AND numero = $6 AND complemento = $7',
            [cep, estado, cidade, bairro, rua, numero, complemento || null]
        );

        if (result.rows.length > 0) {
            return result.rows[0].id;
        }
        return null;
    } catch (error) {
        console.error('Error finding address:', error);
        throw new Error('Database query error');
    }
};

export const getPatients = async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || null;
    const offset = parseInt(req.query.offset, 10) || 0;

    try {
        const totalResult = await db.query('SELECT COUNT(*) FROM patients');
        const total = parseInt(totalResult.rows[0].count, 10);

        const { rows } = await db.query(`
            SELECT p.id, p.name, p.birth_date, p.email, 
                   a.cep, a.estado, a.cidade, a.bairro, 
                   a.rua, a.numero, a.complemento
            FROM patients p
            LEFT JOIN addresses a ON p.address_id = a.id
            OFFSET $1
            LIMIT $2
        `, [offset, limit]);

        const patients = rows.map(row => ({
            id: row.id,
            name: row.name,
            birth_date: row.birth_date.toISOString().split('T')[0],
            email: row.email,
            address: {
                cep: row.cep,
                estado: row.estado,
                cidade: row.cidade,
                bairro: row.bairro,
                rua: row.rua,
                numero: row.numero,
                complemento: row.complemento
            }
        }));

        res.status(200).json({ total, patients });
    } catch (error) {
        console.error('Error getting patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(`
            SELECT p.id, p.name, p.birth_date, p.email, 
                   a.cep, a.estado, a.cidade, a.bairro, 
                   a.rua, a.numero, a.complemento
            FROM patients p
            LEFT JOIN addresses a ON p.address_id = a.id
            WHERE p.id = $1
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const patient = {
            id: rows[0].id,
            name: rows[0].name,
            birth_date: rows[0].birth_date,
            email: rows[0].email,
            address: {
                cep: rows[0].cep,
                estado: rows[0].estado,
                cidade: rows[0].cidade,
                bairro: rows[0].bairro,
                rua: rows[0].rua,
                numero: rows[0].numero,
                complemento: rows[0].complemento
            }
        };

        res.status(200).json(patient);
    } catch (error) {
        console.error('Error getting patient by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createPatient = async (req, res) => {
    const { error, value } = patientModel.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, birth_date, email, address } = value;

    try {
        let addressId = await findAddress(address);

        if (!addressId) {
            const addressResult = await db.query(
                'INSERT INTO addresses (cep, estado, cidade, bairro, rua, numero, complemento) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                [address.cep, address.estado, address.cidade, address.bairro, address.rua, address.numero, address.complemento || null]
            );
            addressId = addressResult.rows[0].id;
        }

        const patient = await db.query(
            'INSERT INTO patients (name, birth_date, email, address_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, birth_date, email, addressId]
        );
        res.status(201).json(patient.rows[0]);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { error, value } = patientModel.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, birth_date, email, address } = value;

    if (!name && !birth_date && !email && !address) {
        return res.status(400).json({ error: 'At least one field must be updated' });
    }

    try {
        if (address) {
            let addressId = await findAddress(address);

            if (!addressId) {
                const addressResult = await db.query(
                    'UPDATE addresses SET cep = $1, estado = $2, cidade = $3, bairro = $4, rua = $5, numero = $6, complemento = $7 WHERE id = (SELECT address_id FROM patients WHERE id = $8) RETURNING id',
                    [address.cep, address.estado, address.cidade, address.bairro, address.rua, address.numero, address.complemento || null, id]
                );
                addressId = addressResult.rows[0].id;
            } else {
                await db.query(
                    'UPDATE addresses SET cep = $1, estado = $2, cidade = $3, bairro = $4, rua = $5, numero = $6, complemento = $7 WHERE id = $8',
                    [address.cep, address.estado, address.cidade, address.bairro, address.rua, address.numero, address.complemento || null, addressId]
                );
            }

            await db.query(
                'UPDATE patients SET name = $1, birth_date = $2, email = $3, address_id = $4 WHERE id = $5 RETURNING *',
                [name, birth_date, email, addressId, id]
            );
        } else {
            await db.query(
                'UPDATE patients SET name = $1, birth_date = $2, email = $3 WHERE id = $4 RETURNING *',
                [name, birth_date, email, id]
            );
        }

        res.status(200).json({ message: 'Patient updated successfully' });
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

        await db.query('DELETE FROM addresses WHERE id = (SELECT address_id FROM patients WHERE id = $1)', [id]);

        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};