import express, { Request, Response } from "express";

const mainRouter = express.Router();

mainRouter.get("/", (req: Request, res: Response) => {
    res.send(`Main router`);
});

mainRouter.get("/:any", (req: Request, res: Response) => {
    res.send("Hello World!");
});

export default mainRouter