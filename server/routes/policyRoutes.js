const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getPolicies, getPolicy, createPolicy, updatePolicy, deletePolicy, comparePolicy,
} = require('../controllers/policyController');

router.get('/', getPolicies);
router.get('/compare', comparePolicy);
router.get('/:id', getPolicy);
router.post('/', protect, authorize('government', 'admin'), upload.single('document'), createPolicy);
router.put('/:id', protect, authorize('government', 'admin'), upload.single('document'), updatePolicy);
router.delete('/:id', protect, authorize('admin'), deletePolicy);

module.exports = router;
