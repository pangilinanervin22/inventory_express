import express, { Request, Response } from "express";
import { sqlExe } from "../config/database";
import product from "../controller/product";
import { asyncHandle } from "../middleware/errorHandler";

const routerProduct = express.Router();

routerProduct.get("/", asyncHandle(product.getAllProduct));

export default routerProduct;
