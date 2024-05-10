import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().required(),
    phone: Joi.string().min(7)
        .max(16)
        .required(),
    owner: Joi.object()
})

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string(),
    phone: Joi.string().min(7)
        .max(16),
});

export const updateStatusSchema = Joi.object({
    favorite: Joi.boolean().required()
})