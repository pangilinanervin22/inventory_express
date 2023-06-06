import express, { Request, Response } from "express";
import { randomInt, randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

const routerMain = express.Router();

routerMain.get("/main/random/picture", (req, res) => {
	res.send(faker.image.urlLoremFlickr({ category: "chocolate" }));
});

routerMain.get("/main/random/id", (req, res) => {
	res.send(randomUUID());
});

routerMain.get("/main/random", (req, res) => {
	const data = ["Java", "Javascript", "Python", "C++", "Cobol"];
	res.send("Hello " + data[randomInt(data.length)]);
});

routerMain.get("/main/:message/", (req: Request, res: Response) => {
	const data = req.params.message;
	if (data == "error") throw new Error("Sample Error");

	res.send(`Message ` + req.params.message);
});

export default routerMain;
