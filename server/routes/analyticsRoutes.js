const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

router.get('/admin', authMiddleware, requireRole('admin'), AnalyticsController.getAdminStats);
router.get('/supplier', authMiddleware, requireRole('supplier'), AnalyticsController.getSupplierStats);

module.exports = router;