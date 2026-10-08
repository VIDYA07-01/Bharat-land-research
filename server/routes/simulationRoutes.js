const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { runSimulation, getSimulations, getSimulation, deleteSimulation } = require('../controllers/simulationController');

router.post('/run', protect, authorize('researcher', 'government', 'admin'), runSimulation);
router.get('/', protect, getSimulations);
router.get('/:id', protect, getSimulation);
router.delete('/:id', protect, deleteSimulation);

module.exports = router;
