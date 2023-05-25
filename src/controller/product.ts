import { Request, Response } from "express";
import joi from "joi";

const Dog = joi.object({
	name: joi.string().max(255).min(3).required(),
	age: joi.number(),
});

export default {
	async getAllProduct(req: Request, res: Response) {
		// const data = await sqlExe("SELECT * FROM Movie;");
		res.send("product");
	},

	async addProduct(req: Request, res: Response) {
		const { error } = Dog.validate(req.body);

		const data = error?.message || "hello";
		res.send(data).status(200);
	},
};
