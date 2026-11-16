// server/services/analyticsService.js
const AnalyticsModel = require('../models/analyticsModel');
const db = require('../config/db');

const AnalyticsService = {
    getAdminStats: async () => {
        const suppliers = await AnalyticsModel.getSupplierRevenue();
        const recipients = await AnalyticsModel.getRecipientStats();
        const occasions = await AnalyticsModel.getOccasionStats();
        return { suppliers, recipients, occasions };
    },

    getSupplierStats: async (userId) => {
        // Находим ID поставщика по ID пользователя
        const [suppliers] = await db.query('SELECT id FROM suppliers WHERE user_id = ?', [userId]);
        if (suppliers.length === 0) throw new Error('Профиль поставщика не найден');
        
        const supplierId = suppliers[0].id;
        const revenue = await AnalyticsModel.getSupplierOwnRevenue(supplierId);
        
        // Получаем список его товаров с остатками
        const [products] = await db.query(
            'SELECT name, stock_quantity, price FROM products WHERE supplier_id = ? ORDER BY stock_quantity DESC', 
            [supplierId]
        );

        return { revenue, products };
    }
};

module.exports = AnalyticsService;