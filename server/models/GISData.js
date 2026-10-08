const mongoose = require('mongoose');

const GISDataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'state_boundary', 'district_boundary', 'agricultural_land',
        'urban_land', 'forest', 'water_bodies', 'infrastructure',
        'land_use_change', 'climate_vulnerability', 'land_disputes',
        'development_projects',
      ],
      required: true,
    },
    state: { type: String },
    district: { type: String },
    geoJSON: { type: Object },
    properties: {
      totalArea: { type: Number },
      agriculturalArea: { type: Number },
      urbanArea: { type: Number },
      forestArea: { type: Number },
      waterArea: { type: Number },
      population: { type: Number },
      climateRiskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'very_high'],
      },
      droughtRisk: { type: String },
      floodRisk: { type: String },
      landDegradation: { type: String },
      infrastructureScore: { type: Number },
      landUseChangePercent: { type: Number },
      activeLandDisputes: { type: Number },
    },
    year: { type: Number, default: 2024 },
    source: { type: String, default: 'Demo Data - Not Official Government Data' },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GISDataSchema.index({ type: 1, state: 1 });

module.exports = mongoose.model('GISData', GISDataSchema);
