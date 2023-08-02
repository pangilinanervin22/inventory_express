import express from "express";
import product from "../controller/product";
import { asyncHandle } from "../middleware/errorHandler";
import employee from "../controller/employee";

const routerProduct = express.Router();

if (process.env.NODE_ENV == "dev")
    routerProduct.post("/generate", [employee.authEmployee], asyncHandle(product.generateProduct));

routerProduct
    .route("/")
    .get(product.getAllProduct)
    .post([employee.authEmployee], product.createProduct)
    .put([employee.authEmployee], product.updateProduct);

routerProduct
    .route("/:id")
    .get([employee.authEmployee], product.getProductById)
    .post([employee.authEmployee], product.createProduct)
    .delete([employee.authEmployee], product.deleteProductById)
    .put([employee.authEmployee], product.updateProduct);


export default routerProduct;
