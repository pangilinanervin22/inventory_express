import express from "express";
import sales from "../controller/sales";
import stock from "../controller/stock";
import employee from "../controller/employee";


const routerSales = express.Router();

if (process.env.NODE_ENV == "dev")
    routerSales.post("/generate", sales.generateSales);

routerSales.post("/pos", [employee.authEmployee], stock.posAction);
routerSales.get("/total", sales.getAllSales);

routerSales
    .route("/:id")
    .get(sales.getSalesById)
    .delete(sales.deleteSalesById)
    .put(sales.updateSales);

routerSales
    .route("/")
    .get(sales.getAllSales)
    .post(sales.createSales)
    .put(sales.updateSales)
    .post(sales.createSales);


export default routerSales;
