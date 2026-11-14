const RecommendationService = require('../services/recommendationService');

const RecommendationController = {
    getRecommendations: async (req, res) => {
        try {
            const userId = req.user.id; // Берем из токена
            const products = await RecommendationService.getForUser(userId);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = RecommendationController;