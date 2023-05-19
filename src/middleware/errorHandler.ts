import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 400;
    res.status(status).send(err.message);
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Route not found");
}

