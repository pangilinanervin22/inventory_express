import express, { Request, Response } from "express";
import { sqlExe } from "../config/database";
import { asyncHandle } from "../middleware/errorHandler";
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

routerMain.get(
	"/api/",
	asyncHandle(async (req: Request, res: Response) => {
		const data = await sqlExe("SELECT * FROM MOVIE;");
		res.send(data);
	})
);

routerMain.get("/apis/", async (req: Request, res: Response) => {
	const data = await sqlExe("SELECT * FROM MOVIE;");
	console.log(data);

	res.send("data");
});

export default routerMain;
