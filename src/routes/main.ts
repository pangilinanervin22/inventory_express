import express, { Request, Response } from "express";
import crypto from 'crypto'

const mainRouter = express.Router();

mainRouter.get("/random", (req: Request, res: Response) => {
	res.send(crypto.randomUUID());
});

mainRouter.get("/", (req: Request, res: Response) => {
	res.send("Inventory Express by Ervin Pangilinan");
});

export default mainRouter;
