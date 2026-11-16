// server/models/analyticsModel.js
const db = require('../config/db');

const AnalyticsModel = {
    // 1. Для Администратора: Выручка по поставщикам
    getSupplierRevenue: async () => {
        const [rows] = await db.query(`
            SELECT s.company_name, SUM(oi.quantity * oi.price_at_moment) as total_revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN suppliers s ON p.supplier_id = s.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status != 'cancelled'
            GROUP BY s.id, s.company_name
            ORDER BY total_revenue DESC
        `);
        return rows;
    },

    // 2. Для Администратора: Популярность по получателям (кому дарят)
    getRecipientStats: async () => {
        const [rows] = await db.query(`
            SELECT p.recipient_type, SUM(oi.quantity) as total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status != 'cancelled'
            GROUP BY p.recipient_type
        `);
        return rows;
    },

    // 3. Для Администратора: Популярность по праздникам
    getOccasionStats: async () => {
        const [rows] = await db.query(`
            SELECT p.occasion, SUM(oi.quantity) as total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status != 'cancelled'
            GROUP BY p.occasion
        `);
        return rows;
    },

    // 4. Для Поставщика: Выручка конкретного поставщика
    getSupplierOwnRevenue: async (supplierId) => {
        const [rows] = await db.query(`
            SELECT SUM(oi.quantity * oi.price_at_moment) as total_revenue, COUNT(oi.id) as items_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE p.supplier_id = ? AND o.status != 'cancelled'
        `, [supplierId]);
        return rows[0];
    }
};

module.exports = AnalyticsModel;