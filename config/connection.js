const mysql = require("mysql");
const connObj = { host: "localhost", user: "root", password: "", database: "rodeo" };
let connection; 
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);  
} else {
  connection = mysql.createConnection(connObj);
}
connection.connect(err => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});
module.exports = connection;
