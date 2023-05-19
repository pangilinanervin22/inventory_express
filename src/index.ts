import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from 'dotenv'
// import main from './routes/main'
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import main from "./routes/main";
import { randomInt } from "crypto";

const config: any = dotenv.config().parsed
const app: Application = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/api/random", (req, res) => {
    const data = ["Java", "Javascript", "Python", "C++", "Cobol"]
    res.send("Hello " + data[randomInt(data.length)]);
});

app.get("/api/:message/", (req: Request, res: Response) => {
    const data = req.params.message;
    if (data == "error") throw new Error("Sample Error");

    res.send(`Message ` + req.params.message);
});

app.get("/api/", (req, res) => {
    const data = ["Java", "Javascript", "Python", "C++", "Cobol"]
    res.send("Root ");
});

//routes
app.use("/api/", main)

//error handlers
app.use(errorHandler);
app.use(notFoundHandler);

//server start
app.listen(config.PORT, () => {
    console.log(`Example app listening on port ${config.PORT}`);
    console.log(config);
});
