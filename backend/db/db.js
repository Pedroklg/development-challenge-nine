import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            birth_date DATE NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            address TEXT NOT NULL
        );
    `;
    try {
        await pool.query(query);
        console.log('Table created or already exists');
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

createTable();

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