import express, { Request, Response } from "express";
import stock from "../controller/stock";
import { asyncHandle } from "../middleware/errorHandler";

const routerStock = express.Router();


routerStock.post("/generate", asyncHandle(stock.generateStock));
routerStock.get("/total", asyncHandle(stock.getTotalStock));


routerStock
    .route("/:id")
    .get(asyncHandle(stock.getStockById))
    .delete(asyncHandle(stock.deleteStockById))
    .put(asyncHandle(stock.updateStock));


routerStock
    .route("/")
    .get(asyncHandle(stock.getAllStock))
    .post(asyncHandle(stock.createStock));

export default routerStock;
