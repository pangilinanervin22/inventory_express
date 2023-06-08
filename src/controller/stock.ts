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
        "SELECT * FROM `stock` WHERE stock_id = ?",
        stock_id
    );

    if (data.length == 0) throw new Error("Invalid request: stock not exist");
    return data[0];
}

async function returnStockByProductId(product_id: string) {
    const data = await sqlExe(
        `SELECT SUM(S.quantity), P.name FROM stock AS S CROSS JOIN 
        product AS P WHERE S.product_id = ?;`,
        product_id
    );

    if (data.length == 0) throw new Error("Invalid request: stock not exist");
    return data[0];
}

// exported controllers
export default {
    async getAllStock(req: Request, res: Response) {
        const data =
            await sqlExe(`SELECT S.stock_id, P.product_id, P.name, S.quantity, S.production_date, S.expiration_date 
        FROM stock AS S CROSS JOIN product AS P WHERE S.product_id = P.product_id;
        `);

        res.send(data);
    },

    async getTotalStock(req: Request, res: Response) {
        const data = await sqlExe(`SELECT SUM(S.quantity), P.name FROM stock AS S CROSS
        JOIN product AS P WHERE S.product_id = P.product_id GROUP BY P.product_id;
        `);

        // total stock
        // const data = await sqlExe(`SELECT SUM(S.quantity) FROM stock AS S;`);

        // by month
        // const data =
        //     await sqlExe(`SELECT DATE_FORMAT(s.production_date, '%Y-%m') AS month_year, SUM(S.quantity) FROM stock AS S
        //      GROUP BY DATE_FORMAT(s.production_date, '%Y-%m') ORDER BY DATE_FORMAT(s.production_date, '%Y-%m');`);
        res.send(data);
    },

    async getStockById(req: Request, res: Response) {
        await returnStockById(req.params.id);
        const data = await sqlExe(
            `SELECT S.stock_id, P.product_id, P.name, S.quantity, S.production_date, S.expiration_date 
        FROM stock AS S CROSS JOIN product AS P WHERE S.stock_id = ? and S.product_id = P.product_id;`,
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
        const data = await returnStockById(req.params.id || req.body.stock_id);
        const stock: Stock = { ...data, ...req.body };

        console.log(stock);

        const { error } = joiStock.validate(stock);
        if (error?.message) throw new Error(error?.message);

        const fetch = await sqlExe(
            "UPDATE `stock` SET `product_id` = ?, `quantity` = ?, `production_date` = ?, `expiration_date` = ? WHERE stock_id = ?;",
            [
                stock.product_id,
                stock.quantity,
                stock.production_date,
                stock.expiration_date,
                req.params.id,
                stock.stock_id,
            ]
        );

        console.log(fetch);
        res.send([data, stock]).status(200);
    },

    // ALL controller below will be availbe only in development
    async generateStock(req: Request, res: Response) {
        const product = await returnProductByName(req.body.name);
        const stock = generateStock(product.product_id);
        const fetch = await sqlExe(
            "INSERT INTO `stock`(`stock_id`, `product_id`, `quantity`, `production_date`, `expiration_date`) VALUES (?,?,?,?,?);",
            [
                stock.stock_id,
                product.product_id,
                stock.quantity,
                stock.production_date,
                stock.expiration_date,
            ]
        );

        res.send([{ ...stock, name: product.name }]).status(200);
    },
};
