module.exports = {
    HOST: process.env.MYSQLHOST || "mysql.railway.internal",
    DB: process.env.MYSQLUSER || "root",
    USER: process.env.MYSQLUSER || "root",
    PASSWORD: process.env.MYSQLPASSWORD || "admin4848",
    PORT: process.env.MYSQLPORT || 3306,
};