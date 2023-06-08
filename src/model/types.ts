export interface Product {
	product_id: string;
	name: string;
	price: number;
	brand: string;
}

export interface Stock {
	stock_id: string;
	product_id: string;
	quantity: number;
	production_date: Date;
	expiration_date: Date;
}

export interface Sales {
	sales_id: string;
	product_id: string;
	total_price: number;
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