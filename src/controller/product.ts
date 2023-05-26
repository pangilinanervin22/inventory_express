import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import joi from "joi";

import { sqlExe } from "../config/database";
import { Product } from "../model/types";
import { compareObject } from "../utils";

const joiProduct = joi.object({
    product_id: joi.string().max(255).optional(),
    name: joi.string().max(70).min(3).required(),
    price: joi.number().required(),
    img_src: joi.string().max(70).required(),
});

function generateProduct(): Product {
    return {
        product_id: faker.string.uuid(),
        name: faker.commerce.product(),
        price: Number(faker.commerce.price({ max: 1000 })),
        img_src: faker.image.avatarGitHub(),
    };
}

async function isProductExist(product_id: string) {
    const data = await sqlExe(
        "SELECT * FROM `product` WHERE product_id = ?",
        product_id
    );

    if (data.length == 0) throw new Error("Invalid request: product not exist");

    return data;
}

// exported controllers
export default {
    async getAllProduct(req: Request, res: Response) {
        const data = await sqlExe("SELECT * FROM ??", "Product");

        res.send(data);
    },

    async getProductById(req: Request, res: Response) {
        const data = await isProductExist(req.params.id);

        res.send(data[0]).status(200);
    },

    async deleteProductById(req: Request, res: Response) {
        await isProductExist(req.params.id);

        await sqlExe("DELETE FROM `product` WHERE product_id = ?", req.params.id);
        res.send("Successfully deleted").status(200);
    },

    async addProduct(req: Request, res: Response) {
        const { error } = joiProduct.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const product: Product = { ...req.body, product_id: crypto.randomUUID() };
        await sqlExe(
            "INSERT INTO `product` (`product_id`, `name`, `price`, `img_src`) VALUES (?, ?, ?, ?)",
            [product.product_id, product.name, product.price, product.img_src]
        );

        res.send(product).status(200);
    },

    async updateProduct(req: Request, res: Response) {
        const product: Product = { ...req.body };

        const data = await isProductExist(req.params.id || product.product_id);
        const { error } = joiProduct.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        await sqlExe(
            "UPDATE `product` SET `name`= ?,`price`= ?,`img_src`= ? WHERE `product_id` = ?",
            [product.name, product.price, product.img_src, product.product_id]
        );

        res.send([data[0], product]).status(200);
    },

    // ALL controller below will be availbe only in development
    async generateProduct(req: Request, res: Response) {
        const { error } = joiProduct.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const product = await generateProduct();
        const fetch = await sqlExe(
            "INSERT INTO `product` (`product_id`, `name`, `price`, `img_src`) VALUES (?, ?, ?, ?)",
            Object.values(product)
        );
        console.log(product, fetch);
        res.send(product).status(200);
    },

    async deleteProductByName(req: Request, res: Response) {
        console.log(req.params.name);
        await sqlExe("DELETE FROM `product` WHERE name = ?", req.params.name);
        res.send("Successfully deleted").status(200);
    },
};
