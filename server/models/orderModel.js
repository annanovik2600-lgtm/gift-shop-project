// server/models/orderModel.js
const db = require('../config/db');

const OrderModel = {
    // Создание заказа с использованием транзакции
    createOrder: async (userId, items, totalAmount, deliveryAddress, paymentMethod) => {
        const connection = await db.getConnection(); // Берем одно соединение для транзакции
        
        try {
            await connection.beginTransaction(); // НАЧАЛО ТРАНЗАКЦИИ

            // 1. Создаем сам заказ
            const [orderResult] = await connection.query(
                `INSERT INTO orders (user_id, total_amount, delivery_address, payment_method, status) 
                 VALUES (?, ?, ?, ?, 'new')`,
                [userId, totalAmount, deliveryAddress, paymentMethod]
            );
            const orderId = orderResult.insertId;

            // 2. Проходимся по каждому товару в корзине
            for (const item of items) {
                // Проверяем, хватает ли товара на складе
                const [productRows] = await connection.query(
                    'SELECT stock_quantity, price FROM products WHERE id = ? FOR UPDATE', 
                    [item.product_id]
                );
                
                const product = productRows[0];
                if (!product) throw new Error(`Товар с ID ${item.product_id} не найден`);
                if (product.stock_quantity < item.quantity) {
                    throw new Error(`Товара "${item.product_id}" не хватает на складе (осталось: ${product.stock_quantity})`);
                }

                // Добавляем позицию в заказ
                await connection.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price_at_moment) 
                     VALUES (?, ?, ?, ?)`,
                    [orderId, item.product_id, item.quantity, product.price]
                );

                // Вычитаем количество со склада
                await connection.query(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            await connection.commit(); // Если всё ок — СОХРАНЯЕМ (COMMIT)
            return orderId;

        } catch (error) {
            await connection.rollback(); // Если ошибка — ОТМЕНЯЕМ ВСЁ (ROLLBACK)
            throw error;
        } finally {
            connection.release(); // Возвращаем соединение в пул
        }
    },

    // Получить историю заказов конкретного пользователя
    getUserOrders: async (userId) => {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // Для каждого заказа подтягиваем список товаров
        for (let order of orders) {
            const [items] = await db.query(
                `SELECT oi.quantity, oi.price_at_moment, p.name, p.image_url 
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }

        return orders;
    }
};

module.exports = OrderModel;