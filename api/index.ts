require("dotenv").config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// import main from './routes/main'
import { errorHandler, notFoundHandler } from "../src/middleware/errorHandler";
import main from "../src/routes/main.routes";
import { randomInt } from "crypto";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/api/", (req, res) => {
	const data = ["Java", "Javascript", "Python", "C++", "Cobol"];
	res.send("Root ");
});

app.get("/api/random", (req, res) => {
	const data = ["Java", "Javascript", "Python", "C++", "Cobol"];
	res.send("Running in " + data[randomInt(data.length)]);
});

app.get("/api/:message/", (req: Request, res: Response) => {
	const data = req.params.message;
	if (data == "error") throw new Error("Sample Error");

	res.send(`Message ` + req.params.message);
});

//routes
app.use(main);

//error handlers
app.use(errorHandler);
app.use(notFoundHandler);

//server start
module.exports = app;
