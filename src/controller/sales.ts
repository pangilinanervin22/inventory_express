import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import { sqlExe } from "../config/database";
import { Sales } from "../model/types";
import { joiStock } from "../model/validation";
import { returnProductById, returnProductByName } from "./product";

function generateStock(product_id: string): Sales {
    return {
        sales_id: faker.string.uuid(),
        product_id: product_id,
        date: faker.date.anytime(),
        total_price: Number(faker.number.int({ min: 50, max: 100000 })),
    };
}

async function returnSaleById(sales_id: string) {
    const data = await sqlExe(
        "SELECT * FROM `sale` WHERE sales_id = ?",
        sales_id
    );

    if (data.length == 0) throw new Error("Invalid request: product not exist");
    return data;
}

// exported controllers
export default {
    async getAllSales(req: Request, res: Response) {
        const data =
            await sqlExe(`SELECT sales_id, product.name,quantity,production_date,expiration_date 
        FROM sale CROSS JOIN product WHERE sale.product_id = product.product_id;
        `);

        res.send(data);
    },

    async getSalesById(req: Request, res: Response) {
        const data = await sqlExe(
            "SELECT * FROM sale WHERE sales_id = ??",
            req.params.id
        );

        res.send(data[0]).status(200);
    },

    async deleteSalesById(req: Request, res: Response) {
        await returnSaleById(req.params.id);

        await sqlExe("DELETE FROM sale WHERE sales_id = ??", req.params.id);
        res.send("Successfully deleted").status(200);
    },

    async createSales(req: Request, res: Response) {
        const { error } = joiStock.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const product = await returnProductById(req.body.product_id);
        const sales: Sales = {
            ...req.body,
            sales_id: crypto.randomUUID(),
            product_id: product.name,
        };

        await sqlExe(
            "INSERT INTO `sale`(`sales_id`, `product_id`, `quantity`, `production_date`, `expiration_date`) VALUES (?,?,?,?,?);",
            [
                sales.sales_id,
                product.product_id,
                sales.date,
                sales.total_price,
            ]
        );

        res.send(sales).status(200);
    },

    async updateSales(req: Request, res: Response) {
        const sales: Sales = { ...req.body };

        const data = await returnSaleById(req.params.id || sales.product_id);
        const { error } = joiStock.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        await sqlExe(
            "UPDATE `sale` SET `product_id` = ?, `total_price`= ?, `date`= ? WHERE `sales_id` = ?",
            [
                sales.product_id,
                sales.total_price,
                sales.date,
                sales.sales_id,
            ]
        );

        res.send([data, sales]).status(200);
    },

    // ALL controller below will be availbe only in development
    async generateSales(req: Request, res: Response) {
        const product = await returnProductByName(req.params.name);
        const sale = generateStock(product.product_id);
        const fetch = await sqlExe(
            "INSERT INTO `product` (`product_id`, `name`, `price`, `img_src`) VALUES (?, ?, ?, ?)",
            Object.values(sale)
        );

        console.log(sale, fetch);
        res.send([sale, fetch]).status(200);
    },

};
