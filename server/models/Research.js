const mongoose = require('mongoose');

const ResearchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    authors: [
      {
        name: { type: String, required: true },
        affiliation: { type: String },
      },
    ],
    institution: { type: String, trim: true },
    abstract: {
      type: String,
      required: [true, 'Please add an abstract'],
      maxlength: [3000, 'Abstract cannot exceed 3000 characters'],
    },
    keywords: [{ type: String, trim: true, lowercase: true }],
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    publicationYear: { type: Number },
    methodology: { type: String },
    researchType: { type: String, trim: true },
    domain: [{ type: String, trim: true }],
    studyArea: { type: String, trim: true },
    dataSources: [{ type: String, trim: true }],
    evidenceStatus: { type: String, trim: true },
    researchId: { type: String, trim: true },
    datasetId: { type: String, trim: true },
    gisLayerId: { type: String, trim: true },
    policyIds: [{ type: String, trim: true }],
    paperUrl: { type: String, trim: true },
    findings: { type: String },
    document: { type: String },
    documentOriginalName: { type: String },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'published'],
      default: 'pending',
    },
    isPublic: { type: Boolean, default: true },
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reviewNotes: { type: String },
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    citationCount: { type: Number, default: 0 },
    doi: { type: String, trim: true },
    tags: [{ type: String, lowercase: true }],
    relatedPolicies: [{ type: mongoose.Schema.ObjectId, ref: 'Policy' }],
    relatedDatasets: [{ type: mongoose.Schema.ObjectId, ref: 'Dataset' }],
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for full-text search
ResearchSchema.index({
  title: 'text',
  abstract: 'text',
  keywords: 'text',
  institution: 'text',
});
ResearchSchema.index({ status: 1 });
ResearchSchema.index({ category: 1 });
ResearchSchema.index({ state: 1 });
ResearchSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Research', ResearchSchema);
