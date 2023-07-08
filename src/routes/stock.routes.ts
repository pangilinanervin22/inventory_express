import express from "express";
import stock from "../controller/stock";


const routerStock = express.Router();


routerStock.post("/generate", stock.generateStock);

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
