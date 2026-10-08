const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get my notifications
router.get('/', protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort('-createdAt')
      .limit(50)
      .populate('sender', 'name');

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.status(200).json({ success: true, unreadCount, count: notifications.length, data: notifications });
  } catch (err) {
    next(err);
  }
});

// Mark as read
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
});

// Mark all as read
router.put('/read-all', protect, async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
