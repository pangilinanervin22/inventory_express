import Joi from "joi";

export const joiEmployee = Joi.object({
    name: Joi.string().max(70).min(2).required(),
    username: Joi.string().max(70).min(5).required(),
    contact_no: Joi.string().min(5).required(),
    password: Joi.string().max(255).min(8).required(),
    employee_id: Joi.string().max(255).optional(),
    position: Joi.string().max(255).optional(),
    img_src: Joi.string().max(255).optional(),
});

export const joiProduct = Joi.object({
    product_id: Joi.string().max(255).optional(),
    name: Joi.string().max(70).min(3).required(),
    brand: Joi.string().max(70).min(3).required(),
    price: Joi.number().required(),
});


export const joiStock = Joi.object({
    stock_id: Joi.string().max(255).optional(),
    product_id: Joi.string().max(255).required(),
    quantity: Joi.number().min(1).max(1000).required(),
    production_date: Joi.date().required(),
    expiration_date: Joi.date().required(),
});


export const joiSales = Joi.object({
    sales_id: Joi.string().max(255).optional(),
    product_id: Joi.string().max(255).required(),
    total_price: Joi.number().max(100000).required(),
    sales_date: Joi.date().required(),
});