export interface Product {
	product_id: string;
	name: string;
	price: number;
	img_src: string;
	brand: string;
}

export interface Stock {
	stock_id: string;
	product_id: string;
	quantity: number;
	production_date: Date;
	expiration_date: Date;
}

export interface Sale {
	sales_id: string;
	product_id: string;
	total_price: number;
	quantity: number;
	date: Date;
}

export interface Employee {
	employee_id: string;
	name: string;
	username: string;
	password: string;
	contact_no: string;
	is_admin: boolean;
	img_src: string;
}