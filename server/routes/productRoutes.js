// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Публичные маршруты (доступны всем)
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Защищенные маршруты (только для администратора)
router.post('/', authMiddleware, requireRole('admin'), ProductController.create);
router.put('/:id', authMiddleware, requireRole('admin'), ProductController.update);
router.delete('/:id', authMiddleware, requireRole('admin'), ProductController.delete);

module.exports = router;