import Joi from "joi";

export const registerUserSchema = Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

    email: Joi.string().required()
})