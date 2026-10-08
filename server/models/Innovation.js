const mongoose = require('mongoose');

const InnovationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    type: {
      type: String,
      enum: ['hackathon', 'grant', 'pilot', 'challenge', 'competition', 'other'],
      required: [true, 'Please specify the type'],
    },
    organization: {
      type: String,
      required: [true, 'Please add an organization name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    eligibility: { type: String },
    prizePool: { type: String },
    deadline: { type: Date },
    applicationUrl: { type: String },
    contactEmail: { type: String },
    status: {
      type: String,
      enum: ['open', 'closed', 'upcoming', 'completed'],
      default: 'open',
    },
    tags: [{ type: String, lowercase: true }],
    category: { type: String },
    state: { type: String },
    image: { type: String },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    viewCount: { type: Number, default: 0 },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

InnovationSchema.index({ title: 'text', description: 'text' });
InnovationSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Innovation', InnovationSchema);
