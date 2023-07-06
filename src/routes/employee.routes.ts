import express, { Request, Response } from "express";
import employee from "../controller/employee";
import { asyncHandle } from "../middleware/errorHandler";

const routerEmployee = express.Router();

routerEmployee.post("/login", employee.loginEmployee);
routerEmployee.post("/generate", [employee.authenticateEmployee], employee.genereteEmployee);
routerEmployee.get("/auth", [employee.authenticateEmployee], employee.getAllEmployee);
routerEmployee.delete("/name/:name", employee.deleteEmployeeByName);
routerEmployee.put("/edit/", employee.editInfoEmployee)

routerEmployee
    .route("/")
    .get(employee.getAllEmployee)
    .post(employee.createEmployee)
    .put(employee.updateEmployee)
    .put(employee.updateEmployee);

routerEmployee
    .route("/:id")
    .get(employee.getEmployeeById)
    .put(employee.updateEmployee)
    .delete(employee.deleteEmployeeById);

export default routerEmployee;
