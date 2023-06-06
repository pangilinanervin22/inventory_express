import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import { sqlExe } from "../config/database";
import { Stock } from "../model/types";
import { joiStock } from "../model/validation";
import { returnProductById, returnProductByName } from "./product";

function generateStock(product_id: string): Stock {
    return {
        stock_id: faker.string.uuid(),
        product_id: product_id,
        quantity: Number(faker.number.int({ min: 1, max: 20 })),
        expiration_date: faker.date.anytime(),
        production_date: faker.date.anytime(),
    };
}

async function returnStockById(stock_id: string) {
    const data = await sqlExe(
        "SELECT * FROM `product` WHERE stock_id = ?",
        stock_id
    );

    if (data.length == 0) throw new Error("Invalid request: product not exist");
    return data;
}

// exported controllers
export default {
    async getAllStock(req: Request, res: Response) {
        const data =
            await sqlExe(`SELECT stock_id, product.name,quantity,production_date,expiration_date 
        FROM stock CROSS JOIN product WHERE stock.product_id = product.product_id;
        `);

        res.send(data);
    },

    async getStockByStockId(req: Request, res: Response) {
        const data = await sqlExe(
            "SELECT * FROM stock WHERE stock_id = ??",
            req.params.id
        );

        res.send(data[0]).status(200);
    },

    async deleteStockById(req: Request, res: Response) {
        await returnStockById(req.params.id);

        await sqlExe("DELETE FROM stock WHERE stock_id = ??", req.params.id);
        res.send("Successfully deleted").status(200);
    },

    async createStock(req: Request, res: Response) {
        const { error } = joiStock.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const product = await returnProductByName(req.body.product_id);
        const stock: Stock = {
            ...req.body,
            stock_id: crypto.randomUUID(),
            product_id: product.name,
        };

        await sqlExe(
            "INSERT INTO `stock`(`stock_id`, `product_id`, `quantity`, `production_date`, `expiration_date`) VALUES (?,?,?,?,?);",
            [
                stock.stock_id,
                product.product_id,
                stock.quantity,
                stock.production_date,
                stock.expiration_date,
            ]
        );

        res.send(stock).status(200);
    },

    async updateStock(req: Request, res: Response) {
        const stock: Stock = { ...req.body };

        const data = await returnStockById(req.params.id || stock.product_id);
        const { error } = joiStock.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        await sqlExe(
            "UPDATE `stock` SET `name`= ?,`price`= ?,`img_src`= ? WHERE `product_id` = ?",
            [
                stock.stock_id,
                stock.stock_id,
                stock.quantity,
                stock.production_date,
                stock.expiration_date,
            ]
        );

        res.send([data, stock]).status(200);
    },

    // ALL controller below will be availbe only in development
    async generateStock(req: Request, res: Response) {
        const product = await returnProductByName(req.params.name);
        const stock = generateStock(product.product_id);
        const fetch = await sqlExe(
            "INSERT INTO `product` (`product_id`, `name`, `price`, `img_src`) VALUES (?, ?, ?, ?)",
            Object.values(stock)
        );

        console.log(stock, fetch);
        res.send([stock, fetch]).status(200);
    },

    async deleteProductByName(req: Request, res: Response) {
        console.log(req.params.name);
        await sqlExe("DELETE FROM `product` WHERE name = ?", req.params.name);
        res.send("Successfully deleted").status(200);
    },
};
