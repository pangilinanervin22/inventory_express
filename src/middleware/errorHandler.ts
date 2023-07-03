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
	if (err.fatal) {
		err.message = "Database is currently offline";
		err.status = 501
	}

	const status = err.status || 400;
	const message = getErrorMessage(err.message) || err;
	console.log(err, "final");

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
			return "Invalid token";
		default:
			return message;
	}
}