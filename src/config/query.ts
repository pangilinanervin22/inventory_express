export const instantiateDatabaseQueries = [
        "CREATE DATABASE IF NOT EXISTS inventory;",
        "USE inventory;",
        `CREATE TABLE IF NOT EXISTS Product(
        product_id VARCHAR(255),
        name VARCHAR(70) NOT NULL,
        price FLOAT NOT NULL,
        brand VARCHAR(70) NOT NULL,
        PRIMARY KEY(product_id));`,
        `
        CREATE TABLE IF NOT EXISTS Sales(
            sales_id VARCHAR(255) NOT NULL,
            product_id VARCHAR(255) NOT NULL, 
            total_price FLOAT NOT NULL, 
            sales_date DATE DEFAULT(CURRENT_DATE), 
            PRIMARY KEY (sales_id),
            FOREIGN KEY(product_id) REFERENCES Product(product_id));`,
        `CREATE TABLE IF NOT EXISTS Stock(
                stock_id VARCHAR(255) NOT NULL,
                product_id VARCHAR(255) NOT NULL,
                quantity INT(100) NOT NULL,
                production_date DATE DEFAULT(CURRENT_DATE), 
                expiration_date DATE NOT NULL, 
                PRIMARY KEY(stock_id));`,
        `CREATE TABLE IF NOT EXISTS Employee (
                    employee_id VARCHAR(255),
                    name VARCHAR(70) NOT NULL,
                    username VARCHAR(70) NOT NULL,
                    password VARCHAR(70) NOT NULL,
                    contact_no VARCHAR(15) NOT NULL,
                    is_admin BOOLEAN DEFAULT(FALSE),
                    img_src VARCHAR(255) NOT NULL,
                    PRIMARY KEY(employee_id));`,
        `
                    ALTER TABLE stock ADD CONSTRAINT product_stock 
                    FOREIGN KEY (product_id) REFERENCES employee(employee_id) 
                    ON DELETE CASCADE ON UPDATE RESTRICT; `,
        `ALTER TABLE sales ADD CONSTRAINT product_sales FOREIGN KEY 
                    (product_id) REFERENCES product(product_id) 
                    ON DELETE CASCADE ON UPDATE RESTRICT;`,
];
