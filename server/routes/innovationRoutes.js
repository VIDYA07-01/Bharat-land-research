const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getInnovations, getInnovation, createInnovation, updateInnovation, deleteInnovation,
} = require('../controllers/innovationController');

router.get('/', getInnovations);
router.get('/:id', getInnovation);
router.post('/', protect, authorize('admin', 'government'), createInnovation);
router.put('/:id', protect, authorize('admin', 'government'), updateInnovation);
router.delete('/:id', protect, authorize('admin'), deleteInnovation);

module.exports = router;
