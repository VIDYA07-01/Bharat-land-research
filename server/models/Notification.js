const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'research_approved', 'research_rejected', 'dataset_approved',
        'project_invitation', 'new_research', 'innovation_deadline',
        'policy_update', 'comment_added', 'system',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    relatedItem: { type: mongoose.Schema.ObjectId },
    relatedModel: { type: String },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
