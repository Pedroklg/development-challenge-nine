import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

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