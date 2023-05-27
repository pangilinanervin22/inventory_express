import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import bcrypt from "bcrypt";

import joi from "joi";

import { sqlExe } from "../config/database";
import { Employee } from "../model/types";

const joiEmployee = joi.object({
    name: joi.string().max(70).min(2).required(),
    username: joi.string().max(70).min(5).required(),
    password: joi.string().max(30).min(8).required(),
    employee_id: joi.string().max(255).optional(),
    is_admin: joi.boolean().optional(),
});

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(employee.password, salt);

        await sqlExe(
            "INSERT INTO `employee`(`employee_id`, `name`, `username`, `password`, `is_admin`) VALUES (?, ?, ?, ?, ?)",
            [employee.employee_id, employee.name, employee.username, hashedPassword, booleanToInt(employee.is_admin)]
        );

        res.send(employee).status(200);
    },

    async loginEmployee(req: Request, res: Response) {
        const { error } = joiEmployee.validate({ ...req.body, name: "NotRequire" });
        if (error?.message) throw new Error(error?.message);

        const employee: Employee = { ...req.body };
        const employeeDatabase = await findEmployeeById(employee.employee_id);
        const passwordMatch = await bcrypt.compare(
            employee.password,
            employeeDatabase.password
        );

        if (passwordMatch == false) throw new Error("Password don't match");
        res.send(employeeDatabase).status(200);
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
            [employee.name, employee.username, hashedPassword, booleanToInt(employee.is_admin), RequestId]
        );

        res.send([employeeDatabase, employee]).status(200);
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
            [employee.employee_id, employee.name, employee.username, hashedPassword, booleanToInt(employee.is_admin)]
        );

        res.send(employee).status(200);
    },

    async deleteEmployeeByName(req: Request, res: Response) {
        console.log(req.params.name);
        await sqlExe("DELETE FROM `employee` WHERE name = ?", req.params.name);
        res.send("Successfully deleted").status(200);
    },
};
