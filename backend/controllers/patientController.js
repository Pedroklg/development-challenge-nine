import db from '../db/db.js';
import patientModel from '../models/patientModel.js';

const findAddress = async (address) => {
    const { cep, state, city, district, street, number, complement } = address;

    try {
        const result = await db.query(
            'SELECT id FROM addresses WHERE cep = $1 AND state = $2 AND city = $3 AND district = $4 AND street = $5 AND number = $6 AND complement = $7',
            [cep, state, city, district, street, number, complement || null]
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

export const getPatientsSamples = async (req, res) => {
    try {
        const result = await db.query('SELECT id, name FROM patients');
        const patientsSamples = result.rows;
        res.status(200).json(patientsSamples);
    } catch (error) {
        console.error('Error getting patients samples:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPatients = async (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    const offset = parseInt(req.query.offset) || 0;
    const query = req.query.query || null;
    
    const searchTerm = query ? `%${query}%` : '%';

    try {
        const countQuery = `
            SELECT COUNT(*) 
            FROM patients p
            LEFT JOIN addresses a ON p.address_id = a.id
            WHERE p.id::text ILIKE $1 OR p.name ILIKE $1 OR p.email ILIKE $1
        `;
        const totalResult = await db.query(countQuery, [searchTerm]);
        const total = parseInt(totalResult.rows[0].count);

        const fetchQuery = `
            SELECT p.id, p.name, p.birth_date, p.email, 
                   a.cep, a.state, a.city, a.district, 
                   a.street, a.number, a.complement
            FROM patients p
            LEFT JOIN addresses a ON p.address_id = a.id
            WHERE p.id::text ILIKE $1 OR p.name ILIKE $1 OR p.email ILIKE $1
            OFFSET $2
            LIMIT $3
        `;
        const { rows } = await db.query(fetchQuery, [searchTerm, offset, limit]);

        const patients = rows.map(row => ({
            id: row.id,
            name: row.name,
            birth_date: row.birth_date,
            email: row.email,
            address: {
                cep: row.cep,
                state: row.state,
                city: row.city,
                district: row.district,
                street: row.street,
                number: row.number,
                complement: row.complement
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
                   a.cep, a.state, a.city, a.district, 
                   a.street, a.number, a.complement
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
                state: rows[0].state,
                city: rows[0].city,
                district: rows[0].district,
                street: rows[0].street,
                number: rows[0].number,
                complement: rows[0].complement
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
                'INSERT INTO addresses (cep, state, city, district, street, number, complement) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                [address.cep, address.state, address.city, address.district, address.street, address.number, address.complement || null]
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
        let addressId = null;

        if (address) {
            addressId = await findAddress(address);

            if (!addressId) {
                const addressResult = await db.query(
                    'INSERT INTO addresses (cep, state, city, district, street, number, complement) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                    [address.cep, address.state, address.city, address.district, address.street, address.number, address.complement || null]
                );

                addressId = addressResult.rows[0].id;
            } else {
                const addressInUseResult = await db.query(
                    'SELECT COUNT(*) FROM patients WHERE address_id = $1 AND id != $2',
                    [addressId, id]
                );

                const addressInUse = parseInt(addressInUseResult.rows[0].count, 10) > 0;

                if (addressInUse) {
                    const newAddressResult = await db.query(
                        'INSERT INTO addresses (cep, state, city, district, street, number, complement) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                        [address.cep, address.state, address.city, address.district, address.street, address.number, address.complement || null]
                    );

                    addressId = newAddressResult.rows[0].id;
                } else {
                    await db.query(
                        'UPDATE addresses SET cep = $1, state = $2, city = $3, district = $4, street = $5, number = $6, complement = $7 WHERE id = $8',
                        [address.cep, address.state, address.city, address.district, address.street, address.number, address.complement || null, addressId]
                    );
                }
            }
        }

        const updatePatientQuery = `
            UPDATE patients SET 
                name = COALESCE($1, name), 
                birth_date = COALESCE($2, birth_date), 
                email = COALESCE($3, email), 
                address_id = COALESCE($4, address_id) 
            WHERE id = $5 
            RETURNING *`;

        const patientResult = await db.query(updatePatientQuery, [name, birth_date, email, addressId, id]);

        if (patientResult.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        res.status(200).json({ message: 'Patient updated successfully', patient: patientResult.rows[0] });
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