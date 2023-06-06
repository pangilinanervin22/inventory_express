import express, { Request, Response } from "express";
import stock from "../controller/stock";
import { asyncHandle } from "../middleware/errorHandler";

const routerStock = express.Router();


routerStock
    .route("/")
    .get(asyncHandle(stock.getAllStock))
    .post(asyncHandle(stock.createStock))

export default routerStock;
