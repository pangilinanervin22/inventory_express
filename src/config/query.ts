const createProduct = `CREATE TABLE IF NOT EXISTS Product(
    product_id VARCHAR(255),
    name VARCHAR(70) NOT NULL,
    price DOUBLE NOT NULL,
    img_src VARCHAR(70),
    PRIMARY KEY(product_id)
);`;

const createItem = `CREATE TABLE IF NOT EXISTS Item(
    item_id VARCHAR(255),
    product_id VARCHAR(255),
    manufactured_date DATE DEFAULT(CURRENT_DATE),
    expiration_date DATE NOT NULL,
    stocks INT,
    PRIMARY KEY(item_id),
    FOREIGN KEY(product_id) REFERENCES Product(product_id)
);`;

const createEmployee = `CREATE TABLE IF NOT EXISTS Employee (
    employee_id VARCHAR(255),
    name VARCHAR(70) NOT NULL,
    username VARCHAR(70) NOT NULL,
    password VARCHAR(70) NOT NULL,
    is_admin BOOLEAN DEFAULT(FALSE),
    PRIMARY KEY(employee_id)
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
