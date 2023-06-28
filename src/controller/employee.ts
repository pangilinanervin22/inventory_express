import { NextFunction, Request, Response } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sqlExe } from "../config/database";
import { Employee } from "../model/types";
import { joiEmployee } from "../model/validation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandle } from "../middleware/errorHandler";

function generateEmployee(): Employee {
    return {
        employee_id: faker.string.uuid(),
        name: faker.person.fullName(),
        password: "bcrypt2412",
        username: faker.internet.email({ provider: "" }),
        contact_no: faker.phone.number(),
        position: faker.person.jobArea(),
        img_src: faker.image.avatarGitHub()
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

    if (employeeDatabase.length == 0)
        return false;

    return employeeDatabase[0];
}

const getAllEmployee = asyncHandle(async (req: Request, res: Response) => {
    const data = await sqlExe("SELECT `employee_id`, `name`, `username`, `contact_no`, `position` FROM ??", "employee");

    res.send(data);
});

// const  = asyncHandle(async)
const getEmployeeById = asyncHandle(async (req: Request, res: Response) => {
    const data = await findEmployeeById(req.params.id);

    res.send(data).status(200);
})

const deleteEmployeeById = asyncHandle(async (req: Request, res: Response) => {
    await findEmployeeById(req.params.id);

    await sqlExe("DELETE FROM `employee` WHERE employee_id = ?", req.params.id);
    res.send("Successfully deleted").status(200);
})

const createEmployee = asyncHandle(async (req: Request, res: Response) => {
    const { error } = joiEmployee.validate(req.body);
    if (error?.message) throw new Error(error?.message);

    console.log(req.body.img_src || 2);


    const employee: Employee = {
        ...req.body,
        employee_id: crypto.randomUUID(),
        is_admin: req.body.is_admin || false,
        img_src: req.body.img_src || "https://avatars.githubusercontent.com/u/10021",
    };


    const userNameExist = await findEmployeeByUserName(employee.username);
    if (userNameExist) throw new Error("Username is already use")


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.password, salt);

    await sqlExe(
        "INSERT INTO `employee`(`employee_id`, `name`, `username`, `contact_no`, `password`, `is_admin`, `img_src`) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            employee.employee_id,
            employee.name,
            employee.username,
            employee.contact_no,
            hashedPassword,
            employee.position,
            employee.img_src
        ]
    );

    const tokenCreate = jwt.sign({ employee_id: employee.employee_id, position: employee.position },
        process.env.JWT_SECRET_KEY || "",
        { expiresIn: "7d", }
    );

    res.send({ data: employee, token: tokenCreate }).status(200);
})

const updateEmployee = asyncHandle(async (req: Request, res: Response) => {
    const requestId = req.body.employee_id || req.params.id;
    if (!requestId) throw new Error("Invalid Request: no id request");

    const employeeDatabase = await findEmployeeById(requestId);
    const employee: Employee = {
        ...req.body,
        password: employeeDatabase.password,  // must update password with bcrypt
        is_admin: req.body.is_admin || false,
    };

    const { error } = joiEmployee.validate(req.body);
    if (error?.message) throw new Error(error?.message);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.password, salt);
    await sqlExe(
        "UPDATE `employee` SET `name`= ?,`username`= ?, `contact_no`= ?, `password`= ?, `is_Admin` = ? `img_src` = ? WHERE `employee_id` = ?",
        [
            employee.name,
            employee.username,
            employee.contact_no,
            hashedPassword,
            employee.position,
            employee.img_src,
            requestId,
        ]
    );


    res.send([employeeDatabase, employee]).status(200);
})

const loginEmployee = asyncHandle(async (req: Request, res: Response) => {
    const loginData = { ...req.body };

    const employee = await findEmployeeByUserName(loginData.username);
    if (!employee) throw new Error("Username not exist");

    const passwordMatch = await bcrypt.compare(
        loginData.password,
        employee.password
    );

    if (passwordMatch === false) throw new Error("Password don't match");
    const tokenCreate = jwt.sign({ employee_id: employee.employee_id, poistion: employee.poistion },
        process.env.JWT_SECRET_KEY || "",
        { expiresIn: "3d", }
    );
    console.log(tokenCreate, 400);



    res.send(tokenCreate).status(200);
})
const authenticateEmployee = asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];


    if (!token)
        return res.status(401).send('Authorization token missing');

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as JwtPayload;
    } catch (error) {
        res.status(401).send('Authorization token missing');
    }

    next();
})

// exported controllers
export default {
    getAllEmployee,
    getEmployeeById,
    authenticateEmployee,
    loginEmployee,
    updateEmployee,
    createEmployee,
    deleteEmployeeById,

    // ALL controller below will be availbe only in development
    async genereteEmployee(req: Request, res: Response) {
        const generated = await generateEmployee();
        console.log(generated);

        const { error } = joiEmployee.validate(generated);
        if (error?.message) throw new Error(error?.message);

        const employee: Employee = {
            ...generated,
            employee_id: crypto.randomUUID(),
            position: generated.position,
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(employee.password, salt);

        await sqlExe(
            "INSERT INTO `employee`(`employee_id`, `name`, `username`, `contact_no`, `password`, `is_admin`, `img_src`) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                employee.employee_id,
                employee.name,
                employee.username,
                employee.contact_no,
                hashedPassword,
                employee.position,
                employee.img_src
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
