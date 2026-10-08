const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a policy name'],
      trim: true,
      maxlength: [300, 'Name cannot exceed 300 characters'],
    },
    department: { type: String, trim: true },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    state: {
      type: String,
      trim: true,
      default: 'National',
    },
    year: { type: Number },
    description: {
      type: String,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    objective: { type: String },
    keyFeatures: [{ type: String }],
    targetBeneficiaries: { type: String },
    implementationStatus: {
      type: String,
      enum: ['active', 'draft', 'expired', 'under_review'],
      default: 'active',
    },
    document: { type: String },
    documentOriginalName: { type: String },
    keywords: [{ type: String, lowercase: true }],
    tags: [{ type: String, lowercase: true }],
    relatedResearch: [{ type: mongoose.Schema.ObjectId, ref: 'Research' }],
    relatedDatasets: [{ type: mongoose.Schema.ObjectId, ref: 'Dataset' }],
    performanceMetrics: [
      {
        metric: String,
        target: String,
        achieved: String,
        year: Number,
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'published'],
      default: 'published',
    },
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PolicySchema.index({ name: 'text', description: 'text', keywords: 'text' });
PolicySchema.index({ category: 1, state: 1 });
PolicySchema.index({ status: 1 });

module.exports = mongoose.model('Policy', PolicySchema);
