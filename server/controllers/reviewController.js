const ReviewService = require('../services/reviewService');

const ReviewController = {
    getByProduct: async (req, res) => {
        try {
            const reviews = await ReviewService.getProductReviews(req.params.productId);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { productId, rating, comment } = req.body;
            const userId = req.user.id;
            await ReviewService.addReview(userId, productId, rating, comment);
            res.status(201).json({ message: 'Отзыв добавлен' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    reply: async (req, res) => {
        try {
            const { replyText } = req.body;
            const result = await ReviewService.replyToReview(req.params.id, replyText);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = ReviewController;