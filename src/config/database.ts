import mysql from "mysql";

// const connection = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "",
// 	database: "inventory",
// });

const pool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "root",
	password: "",
	database: "inventory",
})

export const sqlExe = (query: string, values?: any) =>
	new Promise<any[]>((resolve, reject) => {
		//creating a connection
		pool.getConnection(async function (errConnection, connection) {
			if (errConnection) reject(errConnection);

			//executing queries
			await connection.query({ sql: query, values }, async function (errQuery, result, fields) {
				if (errQuery) reject(errQuery);
				resolve(result);
			});

			//closing a connection
			connection.release();
		});

	});

function sleep(second: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, second);
	});
}