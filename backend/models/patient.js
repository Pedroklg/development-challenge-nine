import joi from 'joi';

const patientPostSchema = joi.object({
    name: joi.string().required(),
    bithDate: joi.date().required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
});

const patientUpdateSchema = joi.object({
    id: joi.number(),
    name: joi.string(),
    bithDate: joi.date(),
    email: joi.string().email(),
    address: joi.string(),
});

export { patientPostSchema, patientUpdateSchema };