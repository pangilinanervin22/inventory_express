import { Request, Response } from "express";
import { sqlExe } from "../config/database";
import { asyncHandle } from "../middleware/errorHandler";

const getTotalStock = asyncHandle(async (req: Request, res: Response) => {
    const data = await sqlExe(`SELECT SUM(S.quantity), P.name FROM stock AS S CROSS
        JOIN product AS P WHERE S.product_id = P.product_id GROUP BY P.product_id;`);

    res.send(data);
});

const getReportTotal = asyncHandle(async (req: Request, res: Response) => {
    const totalProduct = sqlExe(`SELECT Count(product_id) as total_product FROM product;`);
    const totalStock = sqlExe(`SELECT SUM(quantity) as total_stock FROM stock AS S;`);
    const totalSales = sqlExe(`SELECT SUM(total_price) AS total_sales FROM sales WHERE MONTH(sales_date) = MONTH(CURRENT_DATE)`);

    let promise = await Promise.all([
        totalProduct,
        totalStock,
        totalSales
    ]);

    const temp = {
        total_product: promise[0][0]["total_product"],
        total_stock: promise[1][0]["total_stock"],
        total_sales: promise[2][0]["total_sales"],
    }

    res.send(temp);
});

const getSalesReport = asyncHandle(async (req: Request, res: Response) => {
    const data = await sqlExe(`
        SELECT MONTHNAME(sales_date) AS month,
        YEAR(sales_date) as year,
        SUM(total_price) AS total_sales
        FROM sales WHERE sales_date >= DATE_SUB(CURRENT_DATE, INTERVAL 5 MONTH)
        GROUP BY YEAR(sales_date), MONTH(sales_date) ORDER BY sales_date;`);

    res.send(data);
});

const getTopSales = asyncHandle(async (req: Request, res: Response) => {
    const data = await sqlExe(`SELECT p.name, SUM(s.total_price) AS total_sales
            FROM product p JOIN sales s ON p.product_id = s.product_id
            WHERE YEAR(s.sales_date) = YEAR(CURRENT_DATE)
            GROUP BY p.product_id ORDER BY total_price DESC LIMIT 5`);

    res.send(data);
});

const getLowestStock = asyncHandle(async (req: Request, res: Response) => {
    const data = await sqlExe(`SELECT P.name, MIN(S.quantity) AS quantity FROM stock AS S 
    CROSS JOIN product AS P WHERE S.product_id = P.product_id AND s.quantity < 5 ;`);

    res.send(data[0]);
});

// exported controllers
export default {
    getReportTotal,
    getTopSales,
    getTotalStock,
    getSalesReport,
    getLowestStock,
};