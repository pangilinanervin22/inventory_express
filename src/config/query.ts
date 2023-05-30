const createProduct = `CREATE TABLE IF NOT EXISTS Product(
    product_id VARCHAR(255),
    name VARCHAR(70) NOT NULL,
    price DOUBLE NOT NULL,
    img_src VARCHAR(70),
    PRIMARY KEY(product_id)
);`;

const createStock = `CREATE TABLE IF NOT EXISTS Sale(
    sale_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL, 
    total_price FLOAT NOT NULL, 
    quantity INT(100) NOT NULL, 
    sale_date DATE DEFAULT(CURRENT_DATE), 
    PRIMARY KEY (sale_id),
    FOREIGN KEY(product_id) REFERENCES Product(product_id)
);`;

const createEmployee = `CREATE TABLE IF NOT EXISTS Sale(
    sale_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL, 
    total_price FLOAT NOT NULL, 
    quantity INT(100) NOT NULL, 
    sale_date DATE DEFAULT(CURRENT_DATE), 
    PRIMARY KEY (sale_id),
    FOREIGN KEY(product_id) REFERENCES Product(product_id)
);`;

const createHistory = `CREATE TABLE IF NOT EXISTS History(
    history_id VARCHAR(255),
    employee_id VARCHAR(255),
    name VARCHAR(70) NOT NULL,
    date DATE DEFAULT(CURRENT_DATE),
    action ENUM('CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL,
    PRIMARY KEY(history_id),
    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id)
);`;
