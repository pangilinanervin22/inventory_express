import express, { Request, Response } from "express";
import sales from "../controller/sales";
import { asyncHandle } from "../middleware/errorHandler";

const routerSales = express.Router();


routerSales.post("/generate", asyncHandle(sales.generateSales));
routerSales.get("/total", asyncHandle(sales.getAllSales));


routerSales
    .route("/:id")
    .get(asyncHandle(sales.getSalesById))
    .delete(asyncHandle(sales.deleteSalesById))
    .put(asyncHandle(sales.updateSales));


routerSales
    .route("/")
    .get(asyncHandle(sales.getAllSales))
    .post(asyncHandle(sales.createSales));

export default routerSales;
