import mysql from 'mysql2';
const connection = mysql.createConnection({
    host: "localhost",
    database: "fms",
    user: "root",
    password: "adminii48"
  });
  
        const user = document.getElementById('username');
        const pass = document.getElementById('password');
        console.log("hola");
        boton.addEventListener('click', function() {
            console.log(usernameInput);
    });
        connexion.query(usuariosQuery, (error, results, fields) => {
            if (error) throw error;
            console.log(results); // Aquí puedes manejar los resultados de la consulta
        });