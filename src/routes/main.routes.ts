import express, { Request, Response } from "express";
import { randomInt, randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

import { sqlExe } from "../config/database";
import { instantiateDatabaseQueries } from "../config/query";

const routerMain = express.Router();

routerMain.get("/main/random/picture", (req, res) => {
	res.send(faker.image.urlLoremFlickr({ category: "chocolate" }));
});

routerMain.get("/main/random/id", (req, res) => {
	console.log(req.body);

	res.send(randomUUID());
});

routerMain.get("/main/random", (req, res) => {
	const data = ["Java", "Javascript", "Python", "C++", "Cobol"];
	res.send("Hello " + data[randomInt(data.length)]);
});

routerMain.get("/main/migrate", async (req, res) => {
	const { secret } = req.query;

	// add your desired secret in .env to pass here
	if (secret !== process.env.SECRET)
		res.status(401).send("You cannot access this.");

	const succeed = [];
	const failed = [];

	for (const query of instantiateDatabaseQueries) {
		const result = await sqlExe(query);
		// @ts-ignore
		// pushes the query if you want to check what failed or succeed
		if (result.warningCount === 0) succeed.push(query);
		else failed.push(query);
	}

	res.send(
		`${succeed.length} succeeded and ${failed.length} failed after migrating.`
	);
});

routerMain.get("/main/:message/", (req: Request, res: Response) => {
	const data = req.params.message;
	if (data == "error") throw new Error("Sample Error");

	res.send(`Message ` + req.params.message);
});

export default routerMain;
