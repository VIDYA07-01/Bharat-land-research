const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { queryAssistant, summarizeResearch, getRecommendations, analyzeTrends } = require('../controllers/aiController');

router.post('/query', queryAssistant);
router.get('/recommendations', getRecommendations);
router.post('/summarize', protect, authorize('researcher', 'government', 'admin'), summarizeResearch);
router.post('/trends', protect, authorize('researcher', 'government', 'admin'), analyzeTrends);

module.exports = router;
