// server/controllers/productController.js
const ProductService = require('../services/productService');

const ProductController = {
    getAll: async (req, res) => {
        try {
            const products = await ProductService.getAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllForAdmin: async (req, res) => {
        try {
            const products = await ProductService.getAllForAdmin();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const product = await ProductService.getById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const productData = { ...req.body };
            
            // ВОТ ЭТА СТРОКА ОТВЕЧАЕТ ЗА СОХРАНЕНИЕ ПУТИ
            if (req.file) {
                productData.image_url = `/uploads/${req.file.filename}`;
            }

            const newProductId = await ProductService.create(productData, req.user.role, req.user.id);
            res.status(201).json({ message: 'Товар создан', id: newProductId });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    changeStatus: async (req, res) => {
        try {
            const result = await ProductService.changeStatus(req.params.id, req.body.is_active);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const result = await ProductService.update(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const result = await ProductService.delete(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
};

module.exports = ProductController;