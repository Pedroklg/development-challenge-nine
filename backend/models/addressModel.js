import joi from 'joi';

const addressModel = joi.object({
    cep: joi.string().length(8).pattern(/^\d+$/).required(),
    estado: joi.string().required(),
    cidade: joi.string().required(),
    bairro: joi.string().required(),
    rua: joi.string().required(),
    numero: joi.string().required(),
    complemento: joi.string().allow('').optional(),
});

export default addressModel;