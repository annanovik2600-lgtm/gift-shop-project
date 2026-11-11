// server/services/orderService.js
const OrderModel = require('../models/orderModel');

const OrderService = {
    checkout: async (userId, orderData) => {
        const { items, deliveryAddress, paymentMethod } = orderData;

        if (!items || items.length === 0) {
            throw new Error('Корзина пуста');
        }

        // Считаем общую сумму (в реальном проекте цену лучше брать из БД, но для курсовой сойдет)
        // В нашем случае модель сама подтянет актуальную цену из БД
        let totalAmount = 0; 
        
        const orderId = await OrderModel.createOrder(
            userId, 
            items, 
            totalAmount, // Сумму можно пересчитать внутри модели, но пока оставим 0, потом обновим
            deliveryAddress, 
            paymentMethod
        );

        return { message: 'Заказ успешно оформлен', orderId };
    },

    getHistory: async (userId) => {
        return await OrderModel.getUserOrders(userId);
    }
};

module.exports = OrderService;