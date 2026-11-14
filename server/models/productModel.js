// server/models/productModel.js
const db = require('../config/db');

const ProductModel = {
    // Получить товары для каталога (только активные)
    getAllProducts: async () => {
        const [rows] = await db.query(`
            SELECT p.*, c.name AS category_name, s.company_name AS supplier_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.is_active = 1
        `);
        return rows;
    },

    // Получить ВСЕ товары (для админа, включая скрытые)
    getAllForAdmin: async () => {
        const [rows] = await db.query(`
            SELECT p.*, s.company_name AS supplier_name
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY p.created_at DESC
        `);
        return rows;
    },

    getProductById: async (id) => {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    // Создать товар (is_active зависит от переданного статуса)
    createProduct: async (productData) => {
        const { 
            name, description, price, stock_quantity, 
            min_stock = 5, category_id, supplier_id, image_url, is_active,
            recipient_type, occasion 
        } = productData;
        
        const [result] = await db.query(
            `INSERT INTO products 
            (name, description, price, stock_quantity, min_stock, category_id, supplier_id, image_url, is_active, recipient_type, occasion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, price, stock_quantity, min_stock, category_id, supplier_id, image_url, is_active, recipient_type, occasion]
        );
        return result.insertId;
    },

    // Изменить статус активности (модерация)
    changeStatus: async (id, is_active) => {
        const [result] = await db.query('UPDATE products SET is_active = ? WHERE id = ?', [is_active, id]);
        return result.affectedRows;
    },

    updateProduct: async (id, productData) => {
        const { name, description, price, stock_quantity, recipient_type, occasion, is_active } = productData;
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, recipient_type = ?, occasion = ?, is_active = ? WHERE id = ?',
            [name, description, price, stock_quantity, recipient_type, occasion, is_active, id]
        );
        return result.affectedRows;
    },

        // Получить рекомендованные товары
    getRecommendations: async (recipientType, occasion, userId) => {
        let query = `
            SELECT p.*, c.name AS category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1 
            AND p.id NOT IN (SELECT product_id FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.user_id = ?)
        `;
        const params = [userId];

        // Если у пользователя есть предпочтения, фильтруем по ним
        if (recipientType) {
            query += ` AND p.recipient_type = ?`;
            params.push(recipientType);
        }
        if (occasion) {
            query += ` AND p.occasion = ?`;
            params.push(occasion);
        }

        // Сортируем по рейтингу и ограничиваем 4 товарами
        query += ` ORDER BY p.rating DESC, p.created_at DESC LIMIT 4`;

        const [rows] = await db.query(query, params);
        return rows;
    },

        getBySupplierId: async (supplierId) => {
        const [rows] = await db.query(`
            SELECT p.*, c.name AS category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.supplier_id = ?
            ORDER BY p.created_at DESC
        `, [supplierId]);
        return rows;
    },

    deleteProduct: async (id) => {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]); // Полное удаление для модерации
        return result.affectedRows;
    }
};

module.exports = ProductModel;