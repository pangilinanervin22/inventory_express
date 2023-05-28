import { NextFunction, Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sqlExe } from "../config/database";
import { Employee } from "../model/types";
import { joiEmployee } from "../model/validation";
import jwt, { JwtPayload } from "jsonwebtoken";

function generateEmployee(): Employee {
    return {
        employee_id: faker.string.uuid(),
        name: faker.person.fullName(),
        password: "bcrypt2412",
        username: faker.internet.email({ provider: "" }),
        is_admin: false,
    };
}

function booleanToInt(input: boolean) {
    return input ? 1 : 0;
}

async function findEmployeeById(employee_id: string) {
    const data = await sqlExe(
        "SELECT * FROM `employee` WHERE employee_id = ?",
        employee_id
    );

    if (data.length == 0) throw new Error("Invalid request: employee not exist");
    return data[0];
}

async function findEmployeeByUserName(input: string) {
    const employeeDatabase = await sqlExe(
        "SELECT * FROM `employee` WHERE username = ?", input);

    console.log(employeeDatabase, input);

    if (employeeDatabase.length == 0)
        throw new Error("Invalid request: employee not exist");

    return employeeDatabase[0];
}

// exported controllers
export default {
    async getAllEmployee(req: Request, res: Response) {
        const data = await sqlExe("SELECT * FROM ??", "employee");

        res.send(data);
    },

    async getEmployeeById(req: Request, res: Response) {
        const data = await findEmployeeById(req.params.id);

        res.send(data[0]).status(200);
    },

    async deleteEmployeeById(req: Request, res: Response) {
        await findEmployeeById(req.params.id);

        await sqlExe("DELETE FROM `employee` WHERE employee_id = ?", req.params.id);
        res.send("Successfully deleted").status(200);
    },

    async addEmployee(req: Request, res: Response) {
        const { error } = joiEmployee.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const employee: Employee = {
            ...req.body,
            employee_id: crypto.randomUUID(),
            is_admin: req.body.is_admin || false,
        };

        const userNameExist = await findEmployeeByUserName(employee.username);
        if (userNameExist)
            throw new Error("Invalid request: Username is already use");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(employee.password, salt);

        await sqlExe(
            "INSERT INTO `employee`(`employee_id`, `name`, `username`, `password`, `is_admin`) VALUES (?, ?, ?, ?, ?)",
            [
                employee.employee_id,
                employee.name,
                employee.username,
                hashedPassword,
                booleanToInt(employee.is_admin),
            ]
        );

        const tokenCreate = jwt.sign({ employee_id: employee.employee_id, is_admin: employee.is_admin },
            process.env.JWT_SECRET_KEY || "",
            { expiresIn: "7d", }
        );

        res.send({ data: employee, token: tokenCreate }).status(200);
    },

    async updateEmployee(req: Request, res: Response) {
        const RequestId = req.body.employee_id || req.params.id;
        if (!RequestId) throw new Error("Invalid Request: no id request");

        const employeeDatabase = await findEmployeeById(RequestId);
        const employee: Employee = {
            ...req.body,
            password: req.body.password || employeeDatabase.password,
            is_admin: req.body.is_admin || false,
        };

        const { error } = joiEmployee.validate(req.body);
        if (error?.message) throw new Error(error?.message);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(employee.password, salt);
        await sqlExe(
            "UPDATE `employee` SET `name`= ?,`username`= ?,`password`= ?, `is_Admin` = ? WHERE `employee_id` = ?",
            [
                employee.name,
                employee.username,
                hashedPassword,
                booleanToInt(employee.is_admin),
                RequestId,
            ]
        );

        res.send([employeeDatabase, employee]).status(200);
    },

    async loginEmployee(req: Request, res: Response) {
        const loginData = { ...req.body };

        const employee = await findEmployeeByUserName(loginData.username);
        const passwordMatch = await bcrypt.compare(
            loginData.password,
            employee.password
        );

        if (passwordMatch === false) throw new Error("Password don't match");
        const tokenCreate = jwt.sign({ employee_id: employee.employee_id, is_admin: employee.is_admin },
            process.env.JWT_SECRET_KEY || "",
            { expiresIn: "7d", }
        );

        res.send(tokenCreate).status(200);
    },

    async authenticateEmployee(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            return res.status(401).send('Authorization token missing');

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as JwtPayload;

        console.log(decodedToken);
        next();
    },

    // ALL controller below will be availbe only in development
    async genereteEmployee(req: Request, res: Response) {
        const generated = await generateEmployee();
        const { error } = joiEmployee.validate(generated);
        if (error?.message) throw new Error(error?.message);

        const employee: Employee = {
            ...generated,
            employee_id: crypto.randomUUID(),
            is_admin: generated.is_admin || false,
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(employee.password, salt);

        await sqlExe(
            "INSERT INTO `employee`(`employee_id`, `name`, `username`, `password`, `is_admin`) VALUES (?, ?, ?, ?, ?)",
            [
                employee.employee_id,
                employee.name,
                employee.username,
                hashedPassword,
                booleanToInt(employee.is_admin),
            ]
        );

        res.send(employee).status(200);
    },

    async deleteEmployeeByName(req: Request, res: Response) {
        console.log(req.params.name);
        await sqlExe("DELETE FROM `employee` WHERE name = ?", req.params.name);
        res.send("Successfully deleted").status(200);
    },
};
