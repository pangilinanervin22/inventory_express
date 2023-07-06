import express, { Request, Response } from "express";
import stock from "../controller/stock";
import { asyncHandle } from "../middleware/errorHandler";

const routerStock = express.Router();


routerStock.post("/generate", stock.generateStock);
routerStock.get("/total", stock.getTotalStock);

routerStock
    .route("/:id")
    .get(stock.getStockById)
    .delete(stock.deleteStockById)
    .put(stock.updateStock);


routerStock
    .route("/")
    .get(stock.getAllStock)
    .post(stock.createStock)
    .put(stock.updateStock);


export default routerStock;
