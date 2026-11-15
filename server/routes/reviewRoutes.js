const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Публичный маршрут (все могут читать отзывы)
router.get('/product/:productId', ReviewController.getByProduct);

// Только авторизованные покупатели могут писать отзывы
router.post('/', authMiddleware, requireRole('user'), ReviewController.create);

// Только поставщики могут отвечать
router.put('/:id/reply', authMiddleware, requireRole('supplier'), ReviewController.reply);

module.exports = router;