// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Публичные маршруты
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Пример защищенного маршрута (только для авторизованных)
router.get('/me', authMiddleware, (req, res) => {
    res.json({ message: 'Доступ к профилю разрешен', user: req.user });
});

// Пример маршрута только для администратора (проверка ролей)
router.get('/admin-only', authMiddleware, requireRole('admin'), (req, res) => {
    res.json({ message: 'Привет, Администратор!' });
});

module.exports = router;