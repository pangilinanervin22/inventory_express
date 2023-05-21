import express, { Request, Response } from "express";
import product from "../controller/product";
import { asyncHandle } from "../middleware/errorHandler";

const routerProduct = express.Router();

routerProduct.get("/", asyncHandle(product.getAllProduct));
routerProduct.post("/", asyncHandle(product.addProduct));

export default routerProduct;
