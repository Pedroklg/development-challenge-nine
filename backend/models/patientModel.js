import joi from 'joi';

const patientModel = joi.object({
    name: joi.string().required(),
    birth_date: joi.date().required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
});

export default patientModel;