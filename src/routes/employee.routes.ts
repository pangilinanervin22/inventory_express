import express from "express";
import employee from "../controller/employee";


const routerEmployee = express.Router();

if (process.env.NODE_ENV == "dev") {
    routerEmployee.post("/generate", [employee.authEmployee], employee.genereteEmployee);
    routerEmployee.post("/auth_test", [employee.authEmployee], employee.getAllEmployee);
    routerEmployee.post("/test_admin", [employee.authAdmin], employee.getAllEmployee);

    routerEmployee.delete("/name/:name", [employee.authEmployee], employee.deleteEmployeeByName);
}

routerEmployee.get("/token/", employee.getEmployeeByToken)
routerEmployee.post("/login", employee.loginEmployee);
routerEmployee.put("/edit/", [employee.authEmployee], employee.editInfoEmployee);

routerEmployee
    .route("/")
    .get([employee.authEmployee], employee.getAllEmployee)
    .post([employee.authEmployee], employee.createEmployee)
    .put([employee.authAdmin], employee.updateEmployee)

routerEmployee
    .route("/:id")
    .get([employee.authEmployee], employee.getEmployeeById)
    .put([employee.authAdmin], employee.updateEmployee)
    .delete([employee.authAdmin], employee.deleteEmployeeById);

export default routerEmployee;
