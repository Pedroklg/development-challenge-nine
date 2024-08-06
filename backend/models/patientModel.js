import joi from 'joi';
import addressModel from './addressModel.js';

const patientModel = joi.object({
    id: joi.number(),
    name: joi.string().required(),
    birth_date: joi.date().required(),
    email: joi.string().email().required(),
    address: addressModel.required(),
});

export default patientModel;