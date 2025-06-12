
const dbConfig = require("../config/db.config.js");
const mysql = require("mysql2")// Create a connection to the database
const connection = mysql.createConnection(
  {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: dbConfig.PORT || 3306, // Default MySQL port
    multipleStatements: true // Permite múltiples sentencias en una sola consulta
  }
);
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

