// server/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Разрешаем запросы с React (другой порт)
app.use(express.json()); // Парсим JSON из тела запроса

// Использование маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});