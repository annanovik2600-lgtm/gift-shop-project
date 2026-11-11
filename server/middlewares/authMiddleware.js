// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Доступ запрещен. Требуется токен.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Сохраняем данные пользователя в запросе
        next(); // Пропускаем дальше
    } catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
    }
};

// Middleware для проверки конкретной роли (например, только для админа)
const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: 'Доступ запрещен. Недостаточно прав.' });
        }
        next();
    };
};

module.exports = { authMiddleware, requireRole };