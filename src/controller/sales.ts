import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import { sqlExe } from "../config/database";
import { Sales, Stock } from "../model/types";
import { joiSales, joiStock } from "../model/validation";
import { findProductById, returnProductByName } from "./product";
import { asyncHandle } from "../middleware/errorHandler";
import { findStockById } from "./stock";

function generateSales(product_id: string): Sales {
    return {
        sales_id: faker.string.uuid(),
        product_id: product_id,
        sales_date: faker.date.anytime(),
        total_price: Number(faker.number.int({ min: 50, max: 100000 })),
    };
}

async function findSalesById(sales_id: string) {
    if (!sales_id) throw new Error("Invalid Request: no id request");
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
    await findSalesById(req.params.id);

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

    res.send("Sales successfully created").status(201);
});

const updateSales = asyncHandle(async (req: Request, res: Response) => {
    const data = await findSalesById(req.params.id || req.body.sales_id);
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

    res.send("Sales successfully updated").status(201);
});

const posAction = asyncHandle(async (req: Request, res: Response) => {
    const requestDataList = req.body || [];
    console.log(requestDataList);

    if (requestDataList.length === 0) throw new Error("List of request is empty")

    //validation of list of data
    for await (const item of requestDataList) {
        if (item.quantity < 1) throw new Error("Request of quantity most not below 1");

        const data: Stock = await findStockById(item.stock_id);
        if (item.quantity > data.quantity) throw new Error("Request of quantity is greate than orignal");
        else if ((item.quantity - data.quantity) === 0) continue;

        const requestStock: Stock = { ...data, quantity: (data.quantity - item.quantity) };
        const { error } = joiStock.validate(requestStock);
        if (error?.message) throw new Error(error?.message);
    }

    // process list of pos data
    const process = requestDataList.map(async (item: any) => {
        const stockData: Stock = await findStockById(item.stock_id);
        if ((item.quantity - stockData.quantity) === 0)
            await sqlExe("DELETE FROM stock WHERE stock_id = ?", item.stock_id);
        else {
            const requestStock: Stock = { ...stockData, quantity: (stockData.quantity - item.quantity) };
            await sqlExe(
                "UPDATE `stock` SET `quantity` = ? WHERE stock_id = ?;",
                [
                    requestStock.quantity,
                    requestStock.stock_id
                ]
            );
        }

        const sales: Sales = {
            sales_id: crypto.randomUUID(),
            product_id: stockData.product_id,
            sales_date: new Date(),
            total_price: item.price * item.quantity
        };

        return await sqlExe(
            "INSERT INTO `sales`(`sales_id`, `product_id`, `total_price`, `sales_date`) VALUES (?,?,?,?);",
            [
                sales.sales_id,
                sales.product_id,
                sales.total_price,
                sales.sales_date,
            ]
        );
    })

    await Promise.all(process)
    res.send("Sales are successfully process").status(201);
});

// exported controllers
export default {
    getAllSales,
    deleteSalesById,
    createSales,
    updateSales,
    getSalesById,
    posAction,

    // ALL controller below will be available only in development
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
