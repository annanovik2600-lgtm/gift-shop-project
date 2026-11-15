const ReviewModel = require('../models/reviewModel');

const ReviewService = {
    getProductReviews: async (productId) => {
        return await ReviewModel.getByProductId(productId);
    },

    addReview: async (userId, productId, rating, comment) => {
        if (!comment || comment.trim() === '') throw new Error('Текст отзыва не может быть пустым');
        return await ReviewModel.create(userId, productId, rating, comment);
    },

    replyToReview: async (reviewId, replyText) => {
        if (!replyText || replyText.trim() === '') throw new Error('Ответ не может быть пустым');
        const affected = await ReviewModel.addReply(reviewId, replyText);
        if (affected === 0) throw new Error('Отзыв не найден');
        return { message: 'Ответ добавлен' };
    }
};

module.exports = ReviewService;