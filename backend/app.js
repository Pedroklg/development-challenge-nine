import express from 'express';
import cors from 'cors'
import routes from './routes.js';
import './db.js'
import bodyParser from 'body-parser';
import "dotenv/config"

const app = express();

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(routes)

app.listen(8000);