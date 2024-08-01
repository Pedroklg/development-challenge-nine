import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import patientRoutes from './routes/patientRoutes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/patients/api', patientRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

