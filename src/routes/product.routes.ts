import express, { Request, Response } from "express";
import product from "../controller/product";
import { asyncHandle } from "../middleware/errorHandler";

const routerProduct = express.Router();

routerProduct.post("/generate", asyncHandle(product.generateProduct));
routerProduct.delete("/name/:name", asyncHandle(product.deleteProductByName));

routerProduct
    .route("/")
    .get(asyncHandle(product.getAllProduct))
    .post(asyncHandle(product.createProduct))
    .put(asyncHandle(product.updateProduct));

routerProduct
    .route("/:id")
    .get(asyncHandle(product.getProductById))
    .post(asyncHandle(product.createProduct))
    .delete(asyncHandle(product.deleteProductById))
    .put(asyncHandle(product.updateProduct));


export default routerProduct;
