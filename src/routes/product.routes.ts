import express from "express";
import product from "../controller/product";
import { asyncHandle } from "../middleware/errorHandler";

const routerProduct = express.Router();

routerProduct.post("/generate", asyncHandle(product.generateProduct));
routerProduct.delete("/name/:name", asyncHandle(product.deleteProductByName));

routerProduct
    .route("/")
    /**
     * @swagger
     * /product:
     *   tags: Product
     *   get:
     *     summary: Get all product
     *     description: Retrieve a list of all product.
     *     responses:
     *       200:
     *         description: A list of product.
     */
    .get(product.getAllProduct)
    .post(product.createProduct)
    .put(product.updateProduct);

routerProduct
    .route("/:id")
    .get(product.getProductById)
    .post(product.createProduct)
    .delete(product.deleteProductById)
    .put(product.updateProduct);


export default routerProduct;
