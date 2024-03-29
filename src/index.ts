import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './config/openapi.json';

// importing middleware and routers
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import mainRouter from "./routes/main.routes";
import routerProduct from "./routes/product.routes";
import routerEmployee from "./routes/employee.routes";
import routerStock from "./routes/stock.routes";
import routerSales from "./routes/sales.routes";
import routerReport from "./routes/report.routes";

const app: Application = express();

//using third party middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 100, // Limit each IP to 100 requests per `window` 
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

// development middleware
if (process.env.NODE_ENV == "dev") {
	app.use(morgan("dev"));
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

//routes
app.use("/api", mainRouter);
app.use("/api/employee", routerEmployee);
app.use("/api/product", routerProduct);
app.use("/api/stock", routerStock);
app.use("/api/stock", routerStock);
app.use("/api/sales", routerSales);
app.use("/api/report", routerReport);

//error handlers
app.use(errorHandler);
app.use(notFoundHandler);

//server start
app.listen(process.env.PORT, () => {
	console.log(`Example app listening on port ${process.env.PORT}`);
	console.log(dotenv.config().parsed);
});