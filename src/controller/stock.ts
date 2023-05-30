import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import { sqlExe } from "../config/database";
import { Stock } from "../model/types";
import { joiProduct } from "../model/validation";

function generateStock(): Stock {
    return {
        stock_id: faker.string.uuid(),
        product_id: faker.string.uuid(),
        quantity: Number(faker.number.int({ min: 1, max: 10 })),
        expiration_date: faker.date.anytime(),
        production_date: faker.date.anytime(),
    };
}

/*Stock
    stock_id: string;
    product_id: string;
    quantity: number;
    production_date: Date;
    expiration_date: Date;
    INSERT INTO `stock`(`stock_id`, `product_id`, `quantity`, `production_date`, `expiration_date`) VALUES (?,?,?,?);
*/

async function checkReturnSotck(stock_id: string) {
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
        const data = await sqlExe("SELECT * FROM Stock");

        res.send(data);
    },

    async getStockByStockId(req: Request, res: Response) {
        const data = await sqlExe("SELECT * FROM stock WHERE stock_id = ??", req.params.id,);


        res.send(data[0]).status(200);
    },

    async deleteStockById(req: Request, res: Response) {
        await checkReturnSotck(req.params.id);

        await sqlExe("DELETE FROM stock WHERE stock_id = ??", req.params.id,);
        res.send("Successfully deleted").status(200);
    },

    async addStock(req: Request, res: Response) {
        const { error } = joiProduct.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const stock: Stock = { ...req.body, product_id: crypto.randomUUID() };
        await sqlExe(
            "INSERT INTO `stock`(`stock_id`, `product_id`, `quantity`, `production_date`, `expiration_date`) VALUES (?,?,?,?,?);",
            [stock.stock_id, stock.stock_id, stock.quantity, stock.production_date, stock.expiration_date]
        );

        res.send(stock).status(200);
    },

    async updateProduct(req: Request, res: Response) {
        const stock: Stock = { ...req.body };

        const data = await checkReturnSotck(req.params.id || stock.product_id);
        const { error } = joiProduct.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        await sqlExe(
            "UPDATE `stock` SET `name`= ?,`price`= ?,`img_src`= ? WHERE `product_id` = ?",
            [stock.stock_id, stock.stock_id, stock.quantity, stock.production_date, stock.expiration_date]);

        res.send([data, stock]).status(200);
    },

    // ALL controller below will be availbe only in development
    async generateProduct(req: Request, res: Response) {
        const { error } = joiProduct.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const product = await generateStock();
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
