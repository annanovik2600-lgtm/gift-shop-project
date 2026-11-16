const AnalyticsService = require('../services/analyticsService');

const AnalyticsController = {
    getAdminStats: async (req, res) => {
        try {
            const stats = await AnalyticsService.getAdminStats();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getSupplierStats: async (req, res) => {
        try {
            const stats = await AnalyticsService.getSupplierStats(req.user.id);
            res.status(200).json(stats);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = AnalyticsController;