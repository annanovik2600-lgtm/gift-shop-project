// server/models/reviewModel.js
const db = require('../config/db');

const ReviewModel = {
    // Получить все отзывы для конкретного товара
    getByProductId: async (productId) => {
        const [rows] = await db.query(`
            SELECT r.*, u.username 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `, [productId]);
        return rows;
    },

    // Создать новый отзыв
    create: async (userId, productId, rating, comment) => {
        const [result] = await db.query(
            'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, productId, rating, comment]
        );
        return result.insertId;
    },

    // Добавить ответ поставщика
    addReply: async (reviewId, replyText) => {
        const [result] = await db.query(
            'UPDATE reviews SET supplier_reply = ? WHERE id = ?',
            [replyText, reviewId]
        );
        return result.affectedRows;
    }
};

module.exports = ReviewModel;