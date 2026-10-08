const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      enum: ['research', 'dataset', 'policy', 'casestudy', 'innovation'],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'itemTypeRef',
    },
    itemTypeRef: {
      type: String,
      enum: ['Research', 'Dataset', 'Policy', 'CaseStudy', 'Innovation'],
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Ensure one bookmark per user per item
BookmarkSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
