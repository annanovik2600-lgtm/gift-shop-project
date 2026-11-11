// server/config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Создаем пул соединений
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Используем promise-обертку для удобной работы с async/await
const promisePool = pool.promise();

// Проверка подключения (просто для вывода в консоль при старте)
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Ошибка подключения к БД:', err.message);
    } else {
        console.log('Успешное подключение к базе данных MySQL');
        connection.release();
    }
});

module.exports = promisePool;