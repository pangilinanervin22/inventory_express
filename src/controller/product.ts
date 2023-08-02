import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import { sqlExe } from "../config/database";
import { Product } from "../model/types";
import { joiProduct } from "../model/validation";
import { asyncHandle } from "../middleware/errorHandler";

function generateProduct(): Product {
    return {
        product_id: faker.string.uuid(),
        name: faker.commerce.product(),
        price: Number(faker.commerce.price({ max: 1000 })),
        brand: faker.commerce.productName(),
    };
}

export async function findProductById(product_id: string) {
    if (!product_id) throw new Error("Invalid Request: no id request");
    const data = await sqlExe("SELECT * FROM `product` WHERE product_id = ?", product_id);

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

//exported controllers
const getAllProduct = asyncHandle(async (req: Request, res: Response) => {
    const data = await sqlExe("SELECT * FROM ??", "Product");

    res.send(data);
});

const getProductById = asyncHandle(async (req: Request, res: Response) => {
    const data = await findProductById(req.params.id);
    res.send(data);
})

const deleteProductById = asyncHandle(async (req: Request, res: Response) => {
    await findProductById(req.params.id);

    await sqlExe("DELETE FROM `product` WHERE product_id = ?", req.params.id);
    res.send("Product successfully deleted").status(200);
})

const createProduct = asyncHandle(async (req: Request, res: Response) => {
    const product: Product = {
        ...req.body,
        product_id: crypto.randomUUID(),
    };

    const { error } = joiProduct.validate(product);
    if (error?.message) throw new Error(error?.message);

    await sqlExe(
        "INSERT INTO `product` (`product_id`, `name`, `price`, `brand`) VALUES (?, ?, ?, ?)",
        [
            product.product_id,
            product.name,
            product.price,
            product.brand,
        ]
    );

    res.send("Product successfully created").status(201);
})

const updateProduct = asyncHandle(async (req: Request, res: Response) => {
    const data = await findProductById(req.params.id || req.body.product_id);
    const product: Product = { ...data, ...req.body, };

    const { error } = joiProduct.validate(product);
    if (error?.message) throw new Error(error?.message);

    await sqlExe(
        "UPDATE `product` SET `name`= ?,`price`= ?, `brand`= ? WHERE `product_id` = ?",
        [
            product.name,
            product.price,
            product.brand,
            product.product_id,
        ]
    );

    res.send("Product successfully updated").status(201);
});


// exported controllers
export default {
    getAllProduct,
    deleteProductById,
    getProductById,
    createProduct,
    updateProduct,

    // ALL controller below will be available only in development
    async generateProduct(req: Request, res: Response) {
        const product = await generateProduct();
        const fetch = await sqlExe(
            "INSERT INTO `product` (`product_id`, `name`, `price`, `brand`) VALUES (?, ?, ?, ?)",
            [
                product.product_id,
                product.name,
                product.price,
                product.brand,
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
