const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProjects, getPublicProjects, getProject, createProject,
  updateProject, deleteProject, addProjectNote, inviteMember,
} = require('../controllers/projectController');

router.get('/public', getPublicProjects);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, authorize('researcher', 'admin'), createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/notes', protect, addProjectNote);
router.post('/:id/invite', protect, inviteMember);

module.exports = router;
