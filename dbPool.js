//Utilizing replit "secrets to hide server info" located on the left under navigation under 'files'
const dbHost = process.env['dbHost']
const dbName = process.env['dbName']
const dbPassword = process.env['dbPassword']
const dbUser = process.env['dbUser']

const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName
});
executeSQL = async function (sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
        // console.log('connected as id ' + pool.threadId);
      resolve(rows);
    });
  });
}
module.exports = executeSQL;