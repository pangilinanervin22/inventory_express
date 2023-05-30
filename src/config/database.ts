import mysql from "mysql";

const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

//function that will use to execute sql querry
//Sample:
//sqlExe("Select * From product");
//sqlExe("Select * From ?", "product");
//sqlExe("Select * From ?", ["product"]);
export const sqlExe = (query: string, values?: any) =>
	new Promise<any[]>((resolve, reject) => {
		//get a connection in the pool
		pool.getConnection(async function (errConnection, connection) {
			if (errConnection) reject(errConnection);

			//executing queries
			await connection.query(
				{ sql: query, values },
				async function (errQuery, result, fields) {
					if (errQuery) {
						console.log(errQuery);
						reject(errQuery);
					}
					resolve(result);
				}
			);

			//closing a connection
			connection.release();
		});
	});

function sleep(second: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, second);
	});
}
