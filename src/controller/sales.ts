import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import { sqlExe } from "../config/database";
import { Sales } from "../model/types";
import { joiSales } from "../model/validation";
import { returnProductById, returnProductByName } from "./product";
import { asyncHandle } from "../middleware/errorHandler";

function generateSales(product_id: string): Sales {
    return {
        sales_id: faker.string.uuid(),
        product_id: product_id,
        sales_date: faker.date.anytime(),
        total_price: Number(faker.number.int({ min: 50, max: 100000 })),
    };
}

async function returnSaleById(sales_id: string) {
    const data = await sqlExe(
        "SELECT * FROM `sales` WHERE sales_id = ?",
        sales_id
    );

    if (data.length == 0) throw new Error("Invalid request: sales not exist");
    return data[0];
}

const getAllSales = asyncHandle(async (req: Request, res: Response) => {
    const data =
        await sqlExe(`SELECT sales_id, product.name, sales.product_id, total_price, sales_date  
        FROM sales CROSS JOIN product WHERE sales.product_id = product.product_id;
        `);

    res.send(data);
});

const getSalesById = asyncHandle(async (req: Request, res: Response) => {
    const data = await sqlExe(
        "SELECT * FROM sales WHERE sales_id = ??",
        req.params.id
    );

    res.send(data[0]).status(200);
});


const deleteSalesById = asyncHandle(async (req: Request, res: Response) => {
    await returnSaleById(req.params.id);

    await sqlExe("DELETE FROM sales WHERE sales_id = ?", req.params.id);
    res.send("Successfully deleted").status(200);
});


const createSales = asyncHandle(async (req: Request, res: Response) => {
    const sales: Sales = {
        ...req.body,
        sales_id: crypto.randomUUID(),
    };

    const { error } = joiSales.validate(sales);
    if (error?.message) throw new Error(error?.message);

    await sqlExe(
        "INSERT INTO `sales`(`sales_id`, `product_id`, `total_price`, `sales_date`) VALUES (?,?,?,?);",
        [
            sales.sales_id,
            sales.product_id,
            sales.total_price,
            sales.sales_date,
        ]
    );

    res.send(sales).status(200);
});

const updateSales = asyncHandle(async (req: Request, res: Response) => {
    const data = await returnSaleById(req.params.id || req.body.sales_id);
    const sales: Sales = { ...data, ...req.body };

    console.log(sales);

    const { error } = joiSales.validate(sales);
    if (error?.message) throw new Error(error?.message);

    await sqlExe(
        "UPDATE `sales` SET `product_id` = ?, `total_price`= ?, `sales_date`= ? WHERE `sales_id` = ?",
        [
            sales.product_id,
            sales.total_price,
            sales.sales_date,
            sales.sales_id,
        ]
    );

    res.send([data, sales]).status(200);
});




// exported controllers
export default {
    getAllSales,
    deleteSalesById,
    createSales,
    updateSales,
    getSalesById,

    // ALL controller below will be availbe only in development
    async generateSales(req: Request, res: Response) {
        const product = await returnProductByName(req.params.name);
        const sale = generateSales(product.product_id);
        const fetch = await sqlExe(
            "INSERT INTO `product` (`product_id`, `name`, `price`, `img_src`) VALUES (?, ?, ?, ?)",
            Object.values(sale)
        );

        console.log(sale, fetch);
        res.send([sale, fetch]).status(200);
    },

};
