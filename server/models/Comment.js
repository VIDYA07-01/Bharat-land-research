const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment cannot be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      enum: ['research', 'dataset', 'policy', 'casestudy', 'project'],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
      default: null,
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CommentSchema.index({ itemType: 1, itemId: 1 });
CommentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', CommentSchema);
