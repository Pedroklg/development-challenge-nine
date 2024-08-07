import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import patientRoutes from './routes/patientRoutes.js';
import createTables from './db/initDb.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/', patientRoutes);

const startServer = async () => {
    try {
        await createTables();
        console.log('Database initialized');
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
};

startServer();