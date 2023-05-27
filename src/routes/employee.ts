import express, { Request, Response } from "express";
import employee from "../controller/employee";
import { asyncHandle } from "../middleware/errorHandler";

const routerEmployee = express.Router();

routerEmployee.post("/generate", asyncHandle(employee.genereteEmployee));
routerEmployee.delete("/name/:name", asyncHandle(employee.deleteEmployeeByName));

routerEmployee
    .route("/")
    .get(asyncHandle(employee.getAllEmployee))
    .post(asyncHandle(employee.addEmployee))
    .put(asyncHandle(employee.updateEmployee));

routerEmployee
    .route("/:id")
    .get(asyncHandle(employee.getEmployeeById))
    .put(asyncHandle(employee.updateEmployee))
    .delete(asyncHandle(employee.deleteEmployeeById));

export default routerEmployee;
