import express, { Request, Response } from "express";
import sales from "../controller/sales";
import { asyncHandle } from "../middleware/errorHandler";

const routerStock = express.Router();


routerStock.post("/generate", asyncHandle(sales.generateSales));
routerStock.get("/total", asyncHandle(sales.getAllSales));


routerStock
    .route("/:id")
    .get(asyncHandle(sales.getSalesById))
    .delete(asyncHandle(sales.deleteSalesById))
    .put(asyncHandle(sales.updateSales));


routerStock
    .route("/")
    .get(asyncHandle(sales.getAllSales))
    .post(asyncHandle(sales.createSales));

export default routerStock;
