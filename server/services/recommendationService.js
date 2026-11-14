// server/services/recommendationService.js
const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');

const RecommendationService = {
    getForUser: async (userId) => {
        // 1. Узнаем предпочтения пользователя
        const preferences = await OrderModel.getUserPreferences(userId);
        
        let recipientType = null;
        let occasion = null;

        if (preferences) {
            recipientType = preferences.recipient_type;
            occasion = preferences.occasion;
        }

        // 2. Ищем товары (если предпочтений нет, вернет просто популярные)
        const products = await ProductModel.getRecommendations(recipientType, occasion, userId);
        return products;
    }
};

module.exports = RecommendationService;