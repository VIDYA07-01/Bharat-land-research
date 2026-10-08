const mongoose = require('mongoose');

const ResearchProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    objectives: [{ type: String }],
    methodology: { type: String },
    expectedOutcomes: { type: String },
    category: { type: String },
    state: { type: String },
    district: { type: String },
    status: {
      type: String,
      enum: ['proposed', 'active', 'under_review', 'completed'],
      default: 'proposed',
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        role: { type: String, enum: ['lead', 'contributor', 'reviewer'], default: 'contributor' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    invitations: [
      {
        email: { type: String },
        invitedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
        invitedAt: { type: Date, default: Date.now },
      },
    ],
    documents: [
      {
        name: { type: String },
        file: { type: String },
        uploadedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    datasets: [{ type: mongoose.Schema.ObjectId, ref: 'Dataset' }],
    notes: [
      {
        content: { type: String },
        author: { type: mongoose.Schema.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    timeline: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
    tags: [{ type: String, lowercase: true }],
    isPublic: { type: Boolean, default: false },
    completionReport: { type: String },
  },
  { timestamps: true }
);

ResearchProjectSchema.index({ owner: 1 });
ResearchProjectSchema.index({ status: 1 });

module.exports = mongoose.model('ResearchProject', ResearchProjectSchema);
