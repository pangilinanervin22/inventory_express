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
    const tempName = faker.person.firstName();
    const insert = tempName + " " + faker.person.lastName();

    return {
        employee_id: crypto.randomUUID(),
        name: insert,
        password: "passwordchoco",
        username: tempName + "@gmail.com",
        contact_no: faker.phone.number(),
        position: "guest",
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
    const data = await sqlExe("SELECT `employee_id`, `name`, `username`, `contact_no`, `position`, `img_src` FROM ??", "employee");

    res.send(data);
});

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
    const employee: Employee = {
        ...req.body,
        employee_id: crypto.randomUUID(),
        position: req.body.position || "guest",
        img_src: req.body.img_src || "https://avatars.githubusercontent.com/u/10021",
    };

    const { error } = joiEmployee.validate(req.body);
    if (error?.message) throw new Error(error?.message);


    const userNameExist = await findEmployeeByUserName(employee.username);
    if (userNameExist) throw new Error("Username is already use")


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.password, salt);

    await sqlExe(
        "INSERT INTO `employee`(`employee_id`, `name`, `username`, `contact_no`, `password`, `position`, `img_src`) VALUES (?, ?, ?, ?, ?, ?, ?)",
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


    res.send("Your account has been created.").status(200);
})

const updateEmployee = asyncHandle(async (req: Request, res: Response) => {
    const requestId = req.body.employee_id || req.params.id;
    if (!requestId) throw new Error("Invalid Request: no id request");

    const employeeDatabase = await findEmployeeById(requestId);
    const employee: Employee = {
        ...req.body,
        password: employeeDatabase.password,  // must update password with bcrypt
        position: req.body.position || false,
    };

    const { error } = joiEmployee.validate(req.body);
    if (error?.message) throw new Error(error?.message);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.password, salt);
    await sqlExe(
        "UPDATE `employee` SET `name`= ?,`username`= ?, `contact_no`= ?, `password`= ?, `position` = ? `img_src` = ? WHERE `employee_id` = ?",
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
});

const editInfoEmployee = asyncHandle(asyncHandle(async (req: Request, res: Response) => {
    const requestId = req.body.employee_id || req.params.id;
    if (!requestId) throw new Error("Invalid Request: no id request");

    const employeeDatabase = await findEmployeeById(requestId);
    const employee: Employee = {
        ...req.body,
        password: employeeDatabase.password,  // must update password with bcrypt
        position: req.body.position || "guest",
    };

    const { error } = joiEmployee.validate(employee);
    if (error?.message) throw new Error(error?.message);

    await sqlExe(
        "UPDATE `employee` SET `name`= ?,`username`= ?, `contact_no`= ?, `position` = ?, `img_src`= ? WHERE `employee_id` = ?",
        [
            employee.name,
            employee.username,
            employee.contact_no,
            employee.position,
            employee.img_src,
            requestId,
        ]
    );

    res.send([employeeDatabase, employee]).status(200);
}));


const loginEmployee = asyncHandle(async (req: Request, res: Response) => {
    const loginData = { ...req.body };

    const employee: Employee = await findEmployeeByUserName(loginData.username);
    if (!employee) throw new Error("Username not exist");
    if (employee.position == "guest") throw new Error("Username not currently confirm");


    const passwordMatch = await bcrypt.compare(
        loginData.password,
        employee.password
    );

    if (passwordMatch === false) throw new Error("Password don't match");
    const tokenCreate = jwt.sign({ employee_id: employee.employee_id, poistion: employee.position },
        process.env.JWT_SECRET_KEY || "",
        { expiresIn: "3d", }
    );

    const dataSend = {
        token: tokenCreate,
        position: employee.position,
        img_src: employee.img_src
    }

    res.send(dataSend).status(200);
});

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
});

const getEmployeeByToken = asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).send('Authorization token missing');

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as JwtPayload;
        const employee: Employee = await findEmployeeById(decodedToken.employee_id);

        const sendData = {
            employee_id: employee.employee_id,
            name: employee.name,
            username: employee.username,
            img_src: employee.img_src,
            position: employee.position,
            contact_no: employee.contact_no,
        }
        res.status(200).send(sendData);
        return;
    } catch (error) {
        console.log(error);
    }

    res.status(401).send('Authorization token missing');
});

// exported controllers
export default {
    getAllEmployee,
    getEmployeeById,
    authenticateEmployee,
    loginEmployee,
    updateEmployee,
    createEmployee,
    deleteEmployeeById,
    editInfoEmployee,
    getEmployeeByToken,

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
            "INSERT INTO `employee`(`employee_id`, `name`, `username`, `contact_no`, `password`, `position`, `img_src`) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
