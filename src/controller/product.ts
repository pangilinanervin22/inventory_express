import { Request, Response } from "express";
import { sqlExe } from "../config/database";

export default {
    async getAllProduct(req: Request, res: Response) {
        // const data = await sqlExe("SELECT * FROM Movie;");
        res.send("product");
    },
};
