import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
    const addressQuery = `
        CREATE TABLE IF NOT EXISTS addresses (
            id SERIAL PRIMARY KEY,
            cep VARCHAR(8) NOT NULL,
            estado VARCHAR(50) NOT NULL,
            cidade VARCHAR(100) NOT NULL,
            bairro VARCHAR(100) NOT NULL,
            rua VARCHAR(255) NOT NULL,
            numero VARCHAR(10) NOT NULL,
            complemento VARCHAR(255)
        );
    `;

    const patientsQuery = `
        CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            birth_date DATE NOT NULL,
            email VARCHAR(100) NOT NULL,
            address_id INTEGER REFERENCES addresses(id)
        );
    `;

    try {
        await pool.query(addressQuery);
        await pool.query(patientsQuery);
        console.log('Tables created or already exist');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();

const query = async (text, params) => {
    const client = await pool.connect();
    try {
        return await client.query(text, params);
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        client.release();
    }
};

const db = {
    query,
};

export default db;