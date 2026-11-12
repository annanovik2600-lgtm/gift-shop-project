// server/services/orderService.js
const OrderModel = require('../models/orderModel');

const OrderService = {
    checkout: async (userId, orderData) => {
        const { items, deliveryAddress, paymentMethod } = orderData;

        if (!items || items.length === 0) {
            throw new Error('Корзина пуста');
        }

        // Теперь модель сама посчитает сумму
        const orderId = await OrderModel.createOrder(
            userId, 
            items, 
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