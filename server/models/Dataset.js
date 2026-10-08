const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a dataset name'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    organization: { type: String, trim: true },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Land Records', 'Agriculture', 'Climate', 'Infrastructure', 'Population',
        'Urbanization', 'Land Use', 'Geospatial', 'Socio-Economic',
      ],
    },
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    dataFormat: {
      type: String,
      enum: ['CSV', 'JSON', 'GeoJSON', 'Shapefile', 'Excel', 'PDF', 'ZIP', 'Other'],
    },
    year: { type: Number },
    source: { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
    geographicCoverage: { type: String, trim: true },
    tags: [{ type: String, lowercase: true }],
    file: { type: String },
    fileOriginalName: { type: String },
    fileSize: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'published'],
      default: 'pending',
    },
    isPublic: { type: Boolean, default: true },
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    license: { type: String, default: 'Open Data Commons' },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DatasetSchema.index({ name: 'text', description: 'text', tags: 'text' });
DatasetSchema.index({ category: 1, state: 1 });
DatasetSchema.index({ status: 1 });

module.exports = mongoose.model('Dataset', DatasetSchema);
