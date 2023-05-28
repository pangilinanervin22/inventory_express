import Joi from "joi";

export const joiEmployee = Joi.object({
    name: Joi.string().max(70).min(2).required(),
    username: Joi.string().max(70).min(5).required(),
    password: Joi.string().max(30).min(8).required(),
    employee_id: Joi.string().max(255).optional(),
    is_admin: Joi.boolean().optional(),
});

export const joiProduct = Joi.object({
    product_id: Joi.string().max(255).optional(),
    name: Joi.string().max(70).min(3).required(),
    price: Joi.number().required(),
    img_src: Joi.string().max(70).required(),
});
