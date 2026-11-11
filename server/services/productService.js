// server/services/productService.js
const ProductModel = require('../models/productModel');
const db = require('../config/db'); // Нужен для поиска поставщика

const ProductService = {
    getAll: async () => await ProductModel.getAllProducts(),
    getAllForAdmin: async () => await ProductModel.getAllForAdmin(),

    getById: async (id) => {
        const product = await ProductModel.getProductById(id);
        if (!product) throw new Error('Товар не найден');
        return product;
    },

    create: async (data, userRole, userId) => {
        if (!data.name || !data.price) throw new Error('Название и цена обязательны');
        if (data.price <= 0) throw new Error('Цена должна быть больше нуля');

        let supplierId = null;
        let isActive = 1; // Если создает админ — сразу публикуем

        // Если создает поставщик
        if (userRole === 'supplier') {
            isActive = 0; // Скрываем до модерации
            // Ищем ID поставщика в таблице suppliers по user_id
            const [suppliers] = await db.query('SELECT id FROM suppliers WHERE user_id = ?', [userId]);
            if (suppliers.length === 0) throw new Error('Профиль поставщика не найден');
            supplierId = suppliers[0].id;
        }

        const productData = { ...data, supplier_id: supplierId, is_active: isActive };
        return await ProductModel.createProduct(productData);
    },

    changeStatus: async (id, is_active) => {
        const affected = await ProductModel.changeStatus(id, is_active);
        if (affected === 0) throw new Error('Товар не найден');
        return { message: is_active ? 'Товар опубликован' : 'Товар снят с публикации' };
    },

    update: async (id, data) => {
        const affected = await ProductModel.updateProduct(id, data);
        if (affected === 0) throw new Error('Товар не найден');
        return { message: 'Товар обновлен' };
    },

    delete: async (id) => {
        const affected = await ProductModel.deleteProduct(id);
        if (affected === 0) throw new Error('Товар не найден');
        return { message: 'Товар удален' };
    }
};

module.exports = ProductService;