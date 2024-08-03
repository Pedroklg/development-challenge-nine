import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import patientRoutes from './routes/patientRoutes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/', patientRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

