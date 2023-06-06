import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import { sqlExe } from "../config/database";
import { Product } from "../model/types";
import { joiProduct } from "../model/validation";

function generateProduct(): Product {
    return {
        product_id: faker.string.uuid(),
        name: faker.commerce.product(),
        price: Number(faker.commerce.price({ max: 1000 })),
        brand: faker.commerce.productName(),
        img_src: faker.image.urlLoremFlickr({ category: "chocolate" }),
    };
}

export async function returnProductById(product_id: string) {
    const data = await sqlExe(
        "SELECT * FROM `product` WHERE product_id = ?",
        product_id
    );

    if (data.length == 0) throw new Error("Invalid request: product not exist");
    return data[0];
}

export async function returnProductByName(name: string) {
    const data = await sqlExe(
        "SELECT * FROM `product` WHERE name = ?",
        name
    );

    if (data.length == 0) throw new Error("Invalid request: product not exist");
    return data[0];
}

// exported controllers
export default {
    async getAllProduct(req: Request, res: Response) {
        const data = await sqlExe("SELECT * FROM ??", "Product");

        res.send(data);
    },

    async getProductById(req: Request, res: Response) {
        const data = await returnProductById(req.params.id);

        res.send(data[0]).status(200);
    },

    async deleteProductById(req: Request, res: Response) {
        await returnProductById(req.params.id);

        await sqlExe("DELETE FROM `product` WHERE product_id = ?", req.params.id);
        res.send("Successfully deleted").status(200);
    },

    async createProduct(req: Request, res: Response) {
        const { error } = joiProduct.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const product: Product = {
            ...req.body,
            product_id: crypto.randomUUID(),
            img_src:
                req.body.img_src || "https://cdn.onlinewebfonts.com/svg/img_137275.png",
        };

        await sqlExe(
            "INSERT INTO `product` (`product_id`, `name`, `price`, `brand`, `img_src`) VALUES (?, ?, ?, ?, ?)",
            [
                product.product_id,
                product.name,
                product.price,
                product.brand,
                product.img_src,
            ]
        );

        res.send(product).status(200);
    },

    async updateProduct(req: Request, res: Response) {
        const product: Product = { ...req.body };

        const data = await returnProductById(req.params.id || product.product_id);
        const { error } = joiProduct.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        await sqlExe(
            "UPDATE `product` SET `name`= ?,`price`= ?, `brand`= ?,`img_src`= ? WHERE `product_id` = ?",
            [
                product.name,
                product.price,
                product.img_src,
                product.brand,
                product.product_id,
            ]
        );

        res.send([data[0], product]).status(200);
    },

    // ALL controller below will be availbe only in development
    async generateProduct(req: Request, res: Response) {
        const product = await generateProduct();
        const fetch = await sqlExe(
            "INSERT INTO `product` (`product_id`, `name`, `price`, `brand`, `img_src`) VALUES (?, ?, ?, ?, ?)",
            [
                product.product_id,
                product.name,
                product.price,
                product.brand,
                product.img_src,
            ]
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
