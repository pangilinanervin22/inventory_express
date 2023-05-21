import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// import main from './routes/main'
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import mainRouter from "./routes/main";
import routerProduct from "./routes/product";

const config: any = dotenv.config().parsed;
const app: Application = express();

// third party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

//routes
app.use("/api/main/", mainRouter);
app.use("/api/product/", routerProduct);

//error handlers
app.use(errorHandler);
app.use(notFoundHandler);

//server start
app.listen(config.PORT, () => {
	console.log(`Example app listening on port ${config.PORT}`);
	console.log(config);
});
