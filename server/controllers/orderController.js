// server/controllers/orderController.js
const OrderService = require('../services/orderService');

const OrderController = {
    createOrder: async (req, res) => {
        try {
            // ID пользователя мы берем из токена (middleware authMiddleware кладет его в req.user)
            const userId = req.user.id; 
            const result = await OrderService.checkout(userId, req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getMyOrders: async (req, res) => {
        try {
            const userId = req.user.id;
            const orders = await OrderService.getHistory(userId);
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = OrderController;