// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
// Публичные
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Только для админа (просмотр всех, включая скрытые)
router.get('/admin/all', authMiddleware, requireRole('admin'), ProductController.getAllForAdmin);

// Создавать товары могут и Админ, и Поставщик
router.post('/', authMiddleware, requireRole('admin', 'supplier'), upload.single('image'), ProductController.create);

// Модерация (смена статуса), обновление и удаление — только Админ
router.put('/:id/status', authMiddleware, requireRole('admin'), ProductController.changeStatus);
router.put('/:id', authMiddleware, requireRole('admin'), ProductController.update);
router.delete('/:id', authMiddleware, requireRole('admin'), ProductController.delete);

module.exports = router;