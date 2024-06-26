import * as Yup from 'yup';
import Patient from '../models/Patient.js';
import mongoose from 'mongoose';

export default {
    async create(request, response) {
        const { name, birth, email, address } = request.body;
        const data = {
            name,
            birth,
            email,
            address
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            birth: Yup.string().required(),
            email: Yup.string().required(),
            address: Yup.string().required(),
        })

        await schema.validate(data, {
            abortEarly: false,
        })

        const patient = new Patient(data)

        await patient.save()

        return response.status(201).json({
            ...patient
        })
    },

    async getAll(request, response) {
        const patients = await Patient.find({})

        return response.status(200).json(patients)
    },

    async delete(request, response) {
        const { id } = request.params;

        await Patient.deleteOne({
            _id: id
        })

        return response.status(204).json({
            message: "Patient deleted successfully"
        })
    },

    async update(request, response) {
        const { id } = request.params;

        const { name, birth, email, address } = request.body;
        const data = {
            name,
            birth,
            email,
            address
        }

        const schema = Yup.object().shape({
            name: Yup.string(),
            birth: Yup.string(),
            email: Yup.string(),
            address: Yup.string(),
        })

        await schema.validate(data, {
            abortEarly: false,
        })

        await Patient.findOneAndUpdate({ _id: id }, data);

        return response.status(200).json({})
    },
    async getById(request, response) {
        const { id } = request.params;

        const patient = await Patient.find({ _id: id })

        return response.status(200).json({
            patient
        })
    }
}