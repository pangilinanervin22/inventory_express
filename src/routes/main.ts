import express, { Request, Response } from "express";

const main = express.Router();

main.get("/main/", (req: Request, res: Response) => {


    res.send(`Main router`);
});

main.get("/api/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

export default main