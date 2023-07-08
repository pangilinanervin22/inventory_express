import express from "express";
import report from "../controller/report";


const routerReport = express.Router();

routerReport.get("/sample", report.sample);
routerReport.get("/total", report.getTotal);
routerReport.get("/main", report.getTotalStock);
routerReport.get("/popular", report.getTopSales);
routerReport.get("/low", report.getLowestStock);
routerReport.get("/total/sales", report.getSalesReport);



export default routerReport;