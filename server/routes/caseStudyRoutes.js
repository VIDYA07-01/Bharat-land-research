const express = require('express');
const router  = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload  = require('../middleware/upload');
const {
  getCaseStudies, getCaseStudy, createCaseStudy, updateCaseStudy,
  deleteCaseStudy, approveCaseStudy, getCaseStudiesByState,
  getCaseStudiesByDistrict, getCaseStudiesByCategory, searchCaseStudies,
  getLandRecords, getFilterMeta,
} = require('../controllers/caseStudyController');

/* ── public ── */
router.get('/meta/filters',          getFilterMeta);
router.get('/search',                searchCaseStudies);
router.get('/state/:state',          getCaseStudiesByState);
router.get('/district/:district',    getCaseStudiesByDistrict);
router.get('/category/:category',    getCaseStudiesByCategory);
router.get('/',                      optionalAuth, getCaseStudies);
router.get('/:id',                   optionalAuth, getCaseStudy);
router.get('/:id/land-records',      optionalAuth, getLandRecords);

/* ── protected ── */
router.post(
  '/',
  protect,
  authorize('researcher', 'admin'),
  upload.fields([{ name: 'images', maxCount: 5 }, { name: 'documents', maxCount: 3 }]),
  createCaseStudy
);
router.put('/:id',         protect, updateCaseStudy);
router.put('/:id/approve', protect, authorize('admin'), approveCaseStudy);
router.delete('/:id',      protect, authorize('admin'), deleteCaseStudy);

module.exports = router;
