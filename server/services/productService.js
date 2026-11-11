// server/services/productService.js
const ProductModel = require('../models/productModel');

const ProductService = {
    getAll: async () => {
        return await ProductModel.getAllProducts();
    },

    getById: async (id) => {
        const product = await ProductModel.getProductById(id);
        if (!product) {
            throw new Error('Товар не найден');
        }
        return product;
    },

    create: async (data) => {
        // Валидация
        if (!data.name || !data.price) {
            throw new Error('Название и цена товара обязательны');
        }
        if (data.price <= 0) {
            throw new Error('Цена должна быть больше нуля');
        }
        return await ProductModel.createProduct(data);
    },

    update: async (id, data) => {
        const affected = await ProductModel.updateProduct(id, data);
        if (affected === 0) {
            throw new Error('Товар не найден или данные не изменились');
        }
        return { message: 'Товар успешно обновлен' };
    },

    delete: async (id) => {
        const affected = await ProductModel.deleteProduct(id);
        if (affected === 0) {
            throw new Error('Товар не найден');
        }
        return { message: 'Товар успешно удален' };
    }
};

module.exports = ProductService;