
const dbConfig = require("../config/db.config.js");
const mysql = require("mysql2")// Create a connection to the database
const connection = mysql.createConnection(process.env.MYSQL_URL);
// open the MySQL connection
connection.connect((err) => {
    if (err) {
      console.error('Error conectando a la BD:', err);
      return;
    }
    console.log('Conectado a la base de datos MySQL');
   
  });
  connection.promise = () => connection.promise(); // asegúrate de exportar bien el wrapper
module.exports = connection;

