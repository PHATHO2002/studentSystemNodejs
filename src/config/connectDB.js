const mysql = require('mysql2');
require('dotenv').config();

const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
});
let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
// // const connection = mysql.createPool({
// //     host: 'localhost',
// //     port: process.env.DB_PORT,
// //     user: process.env.DB_USER,
// //     password: process.env.DB_PASSWORD,
// //     database: process.env.DB_NAME,
// //     waitForConnections: true,
// //     connectionLimit: 10,
// //     maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
// //     idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
// //     queueLimit: 0,
// //     enableKeepAlive: true,
// //     keepAliveInitialDelay: 0,
// // });

module.exports = connectDB;
