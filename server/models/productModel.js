// server/models/productModel.js
const db = require('../config/db');

const ProductModel = {
    // Получить все товары
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

    // Получить один товар по ID
    getProductById: async (id) => {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    // Создать новый товар
    createProduct: async (productData) => {
        const { 
            name, description, price, stock_quantity, 
            min_stock = 5, // <-- Если min_stock не передан, будет 5
            category_id, supplier_id, image_url 
        } = productData;
        
        const [result] = await db.query(
            `INSERT INTO products 
            (name, description, price, stock_quantity, min_stock, category_id, supplier_id, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, price, stock_quantity, min_stock, category_id, supplier_id, image_url]
        );
        return result.insertId;
    },

    // Обновить товар
    updateProduct: async (id, productData) => {
        const { name, description, price, stock_quantity } = productData;
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ? WHERE id = ?',
            [name, description, price, stock_quantity, id]
        );
        return result.affectedRows;
    },

    // Удалить товар (логическое удаление)
    deleteProduct: async (id) => {
        const [result] = await db.query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = ProductModel;