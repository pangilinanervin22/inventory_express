import express from "express";
import employee from "../controller/employee";


const routerEmployee = express.Router();

routerEmployee.get("/employee", employee.getAllEmployee);
routerEmployee.put("/edit/", employee.editInfoEmployee);
routerEmployee.get("/token/", employee.getEmployeeByToken)
routerEmployee.post("/login", employee.loginEmployee);
routerEmployee.delete("/name/:name", employee.deleteEmployeeByName);
routerEmployee.post("/generate", [employee.authenticateEmployee], employee.genereteEmployee);
routerEmployee.get("/auth", [employee.authenticateEmployee], employee.getAllEmployee);

routerEmployee
    .route("/")
    .get(employee.getAllEmployee)
    .post(employee.createEmployee)
    .put(employee.updateEmployee)

routerEmployee
    .route("/:id")
    .get(employee.getEmployeeById)
    .put(employee.updateEmployee)
    .delete(employee.deleteEmployeeById);

export default routerEmployee;
