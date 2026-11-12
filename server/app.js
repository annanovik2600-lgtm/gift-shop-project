// server/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Разрешаем запросы с React (другой порт)
app.use(express.json()); // Парсим JSON из тела запроса
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Использование маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});