import mysql from "mysql";

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "test",
});

con.connect(function (err) {
	if (err) console.log(err.message);
	else console.log("Connected!");
});

export const sqlExe = (query: string) =>
	new Promise<any[]>((resolve, reject) => {
		con.query(query, async function (err, result, fields) {
			if (err) reject(err.message);
			// console.log(result);

			resolve(result);
		});
	});
