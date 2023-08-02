import express from "express";
import stock from "../controller/stock";
import employee from "../controller/employee";


const routerStock = express.Router();

if (process.env.NODE_ENV == "dev")
    routerStock.post("/generate", stock.generateStock);

routerStock.post("/pos", [employee.authEmployee], stock.posAction);

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
