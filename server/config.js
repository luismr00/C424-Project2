const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

module.exports = db;