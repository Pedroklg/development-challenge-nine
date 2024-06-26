import mongoose from "mongoose";
import "dotenv/config"

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});