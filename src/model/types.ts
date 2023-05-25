export interface Product {
	product_id: string;
	name: string;
	price: number;
	img_src: string;
}

export interface Stock {
	item_id: string;
	product_id: string;
	quantity: number;
	mfd: string;
	expiration: string;
}

export interface Employee {
	employee_id: string;
	name: string;
	username: string;
	password: string;
	is_admin: boolean;
}

export interface history {
	history_id: string;
	employee_id: string;
	product_id: string;
	description: string;
	date: Date;
	action: Action;
}

enum Action {
	"CREATE",
	"UPATE",
	"DELETE",
}
