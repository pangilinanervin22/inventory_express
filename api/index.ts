require("dotenv").config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// import main from './routes/main'
import { errorHandler, notFoundHandler } from "../src/middleware/errorHandler";
import main from "../src/routes/main";

const app: Application = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/api/:message/", (req: Request, res: Response) => {
    const data = req.params.message;
    if (data == "error") throw new Error("Sample Error");

    res.send(`Message ` + req.params.message);
});

app.get("/api/", (req, res) => {
    res.send("Hello World!");
});

//routes
app.use(main)

//error handlers
app.use(errorHandler);
app.use(notFoundHandler);

//server start
module.exports = app;
