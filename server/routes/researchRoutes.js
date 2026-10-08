/**
 * @swagger
 * tags:
 *   name: Research
 *   description: Research repository endpoints
 */
const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getResearchList, getResearch, createResearch, updateResearch,
  deleteResearch, approveResearch, getMyResearch, downloadResearch, getPendingResearch,
} = require('../controllers/researchController');

router.get('/', optionalAuth, getResearchList);
router.get('/my', protect, getMyResearch);
router.get('/pending', protect, authorize('admin'), getPendingResearch);
router.get('/:id', optionalAuth, getResearch);
router.get('/:id/download', downloadResearch);
router.post('/', protect, authorize('researcher', 'admin'), upload.single('document'), createResearch);
router.put('/:id', protect, upload.single('document'), updateResearch);
router.put('/:id/approve', protect, authorize('admin'), approveResearch);
router.delete('/:id', protect, authorize('admin'), deleteResearch);

module.exports = router;
