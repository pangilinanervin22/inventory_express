import express, { Request, Response } from "express";
import { randomInt } from "crypto";

const routerMain = express.Router();

routerMain.get("/api/random", (req, res) => {
	const data = ["Java", "Javascript", "Python", "C++", "Cobol"];
	res.send("Hello " + data[randomInt(data.length)]);
});

routerMain.get("/api/:message/", (req: Request, res: Response) => {
	const data = req.params.message;
	if (data == "error") throw new Error("Sample Error");

	res.send(`Message ` + req.params.message);
});

export default routerMain;
