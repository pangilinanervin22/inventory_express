import { Request, Response } from "express";
import joi from "joi";

import { sqlExe } from "../config/database";

const joiProduct = joi.object({
    name: joi.string().max(255).min(3).required(),
    product_id: joi.number().required(),
});

export default {
    async getAllProduct(req: Request, res: Response) {
        const data = await sqlExe("SELECT * FROM ??", ["Product"]);
        res.send(data);
    },

    async addProduct(req: Request, res: Response) {
        const { error } = joiProduct.validate(req.body);

        const data = await sqlExe("SELECT * FROM Product");


        const s = error?.message || "hello";
        res.send(data).status(200);
    },
};
