const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getLandUseTrends, getClimateResilience, getLandDisputes,
  getPolicyPerformance, getPlatformStats, getAdminStats,
} = require('../controllers/analyticsController');

router.get('/land-use', getLandUseTrends);
router.get('/climate', getClimateResilience);
router.get('/disputes', getLandDisputes);
router.get('/policy-performance', getPolicyPerformance);
router.get('/platform-stats', getPlatformStats);
router.get('/admin-stats', protect, authorize('admin'), getAdminStats);

module.exports = router;
