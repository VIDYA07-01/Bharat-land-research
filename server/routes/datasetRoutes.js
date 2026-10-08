const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getDatasets, getDataset, createDataset, updateDataset,
  deleteDataset, getMyDatasets, downloadDataset, approveDataset,
} = require('../controllers/datasetController');

router.get('/', optionalAuth, getDatasets);
router.get('/my', protect, getMyDatasets);
router.get('/:id', optionalAuth, getDataset);
router.get('/:id/download', downloadDataset);
router.post('/', protect, authorize('researcher', 'admin'), upload.single('file'), createDataset);
router.put('/:id', protect, upload.single('file'), updateDataset);
router.put('/:id/approve', protect, authorize('admin'), approveDataset);
router.delete('/:id', protect, authorize('admin'), deleteDataset);

module.exports = router;
