// server/models/orderModel.js
const db = require('../config/db');

const OrderModel = {
    // Создание заказа с использованием транзакции
    createOrder: async (userId, items, deliveryAddress, paymentMethod) => {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Сначала создаем "пустой" заказ (сумму поставим 0, обновим позже)
            const [orderResult] = await connection.query(
                `INSERT INTO orders (user_id, total_amount, delivery_address, payment_method, status) 
                 VALUES (?, 0, ?, ?, 'new')`,
                [userId, deliveryAddress, paymentMethod]
            );
            const orderId = orderResult.insertId;

            let calculatedTotal = 0; // <-- НОВАЯ ПЕРЕМЕННАЯ ДЛЯ СУММЫ

            // 2. Проходимся по каждому товару
            for (const item of items) {
                const [productRows] = await connection.query(
                    'SELECT stock_quantity, price FROM products WHERE id = ? FOR UPDATE', 
                    [item.product_id]
                );
                
                const product = productRows[0];
                if (!product) throw new Error(`Товар не найден`);
                if (product.stock_quantity < item.quantity) {
                    throw new Error(`Товара не хватает на складе (осталось: ${product.stock_quantity})`);
                }

                // Добавляем позицию в заказ
                await connection.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price_at_moment) 
                     VALUES (?, ?, ?, ?)`,
                    [orderId, item.product_id, item.quantity, product.price]
                );

                // Считаем сумму: цена * количество
                calculatedTotal += parseFloat(product.price) * item.quantity;

                // Вычитаем со склада
                await connection.query(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            // 3. Обновляем итоговую сумму в заказе
            await connection.query(
                'UPDATE orders SET total_amount = ? WHERE id = ?',
                [calculatedTotal, orderId]
            );

            await connection.commit(); 
            return orderId;

        } catch (error) {
            await connection.rollback(); 
            throw error;
        } finally {
            connection.release(); 
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