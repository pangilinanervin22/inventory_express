import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from 'express-rate-limit'

// import main from './routes/main'
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import mainRouter from "./routes/main.routes";
import routerProduct from "./routes/product.routes";
import routerEmployee from "./routes/employee.routes";
import routerStock from "./routes/stock.routes";

const app: Application = express();

// third party middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))

//routes
app.use("/api", mainRouter);
app.use("/api/employee", routerEmployee);
app.use("/api/product", routerProduct);
app.use("/api/stock", routerStock);


//error handlers
app.use(errorHandler);
app.use(notFoundHandler);

//server start
app.listen(process.env.PORT, () => {
	console.log(`Example app listening on port ${process.env.PORT}`);
	console.log(dotenv.config().parsed);
});



