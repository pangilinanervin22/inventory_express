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

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	if (err.fatal) {
		err.message = "Database is currently offline";
		err.status = 500;
	}

	const status = handleErrorMessage(err).status || 400;
	const message = handleErrorMessage(err).message || err;
	console.log(err, err.message, err.status);

	res.status(status).send(message);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	res.status(404).send("Route not found");
};

function handleErrorMessage(error: { status: number; message: string }) {
	switch (error.message) {
		case "jwt malformed":
			return { status: 401, message: "Authorization error: token is corrupt" };
		case "invalid signature":
			return { status: 401, message: "Authorization error: token is invalid" };
		case "unauthorized token":
			return { status: 401, message: "Unauthorized token" };
		default:
			return error;
	}
}
