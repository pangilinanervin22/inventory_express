import { NextFunction, Request, Response } from "express";

export function asyncHandle(handler: Function) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			await handler(req, res, next);
		} catch (error) {
			next(error);
		}
	};
}

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const status = err.status || 400;
	const message = getErrorMessage(err.message)

	res.status(status).send(message);
};

export const notFoundHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(404).send("Route not found");
};


function getErrorMessage(message: string) {
	switch (message) {
		case "jwt malformed":
			return "Inalid token"
			break;

		default:
			return message
			break;
	}

	return
}