// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Защищаем все маршруты заказов (нужен токен)
router.use(authMiddleware);

router.post('/', OrderController.createOrder);       // Оформить заказ
router.get('/my', OrderController.getMyOrders);      // Мои заказы

module.exports = router;