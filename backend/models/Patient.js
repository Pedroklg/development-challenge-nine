import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: String,
    birth: Date,
    email: String,
    address: String
})

const Patient = mongoose.model("Patient", schema, "Patients")

export default Patient;