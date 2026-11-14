const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/recommendationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, RecommendationController.getRecommendations);

module.exports = router;