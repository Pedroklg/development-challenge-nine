import joi from 'joi';

const addressModel = joi.object({
    cep: joi.string().length(8).pattern(/^\d+$/).required(),
    state: joi.string().required(),
    city: joi.string().required(),
    district: joi.string().required(),
    street: joi.string().required(),
    number: joi.string().required(),
    complement: joi.string().allow('').optional(),
});

export default addressModel;