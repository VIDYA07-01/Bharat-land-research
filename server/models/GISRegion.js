const mongoose = require('mongoose');

const UrbanizationYearSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  percentage: { type: Number, required: true },
}, { _id: false });

const LandUseChangeSchema = new mongoose.Schema({
  fromType: { type: String },
  toType: { type: String },
  areaKm2: { type: Number },
  percentChange: { type: Number },
  year: { type: Number },
}, { _id: false });

const InfrastructureMarkerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['road', 'railway', 'hospital', 'industrial', 'project', 'airport', 'port'],
  },
  name: { type: String },
  coordinates: { lat: Number, lng: Number },
  status: { type: String, enum: ['operational', 'under_construction', 'planned'], default: 'operational' },
  year: { type: Number },
}, { _id: false });

const DisputeMarkerSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['boundary', 'ownership', 'encroachment', 'tribal', 'acquisition', 'forest_rights'],
  },
  status: { type: String, enum: ['pending', 'resolved', 'under_review'] },
  coordinates: { lat: Number, lng: Number },
  year: { type: Number },
  description: { type: String },
}, { _id: false });

const GISRegionSchema = new mongoose.Schema(
  {
    country: { type: String, default: 'India' },
    state: { type: String, required: true, trim: true },
    district: { type: String, trim: true, default: null }, // null = state-level record

    // GeoJSON geometry (for Leaflet rendering)
    geometry: {
      type: { type: String, enum: ['Polygon', 'MultiPolygon'], default: 'Polygon' },
      coordinates: { type: mongoose.Schema.Types.Mixed },
    },

    // Bounding box for map zoom [south, west, north, east]
    bounds: {
      south: Number, west: Number, north: Number, east: Number,
    },
    // Center point for map zoom
    center: { lat: Number, lng: Number },

    // Land use in km²
    landUse: {
      agricultural: { type: Number, default: 0 },
      urban: { type: Number, default: 0 },
      forest: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      wasteland: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
      totalArea: { type: Number, default: 0 },
    },

    // Urbanization trend
    urbanization: [UrbanizationYearSchema],

    // Land-use change events
    landUseChanges: [LandUseChangeSchema],

    // Climate data
    climate: {
      vulnerability: {
        type: String,
        enum: ['low', 'moderate', 'high', 'very_high'],
        default: 'moderate',
      },
      floodRisk: { type: Number, min: 0, max: 100, default: 30 },    // 0-100 score
      droughtRisk: { type: Number, min: 0, max: 100, default: 30 },
      heatRisk: { type: Number, min: 0, max: 100, default: 40 },
      landDegradation: { type: Number, min: 0, max: 100, default: 25 },
      annualRainfallMm: { type: Number },
      avgTempCelsius: { type: Number },
    },

    // Infrastructure
    infrastructure: {
      roadsKm: { type: Number, default: 0 },
      railwaysKm: { type: Number, default: 0 },
      hospitals: { type: Number, default: 0 },
      industrialAreas: { type: Number, default: 0 },
      activeProjects: { type: Number, default: 0 },
      infrastructureScore: { type: Number, min: 0, max: 100, default: 50 },
      markers: [InfrastructureMarkerSchema],
    },

    // Disputes
    disputes: {
      total: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      resolved: { type: Number, default: 0 },
      underReview: { type: Number, default: 0 },
      markers: [DisputeMarkerSchema],
    },

    // Demographics
    demographics: {
      population: { type: Number },
      populationDensity: { type: Number }, // per km²
      literacyRate: { type: Number },      // %
      urbanPopulationPct: { type: Number },
    },

    // Agriculture
    agriculture: {
      majorCrops: [{ type: String }],
      irrigatedAreaPct: { type: Number },
      soilHealth: { type: String, enum: ['poor', 'moderate', 'good', 'excellent'] },
    },

    // Admin info
    adminInfo: {
      capital: { type: String },
      region: { type: String },
      code: { type: String },
      talukCount: { type: Number },
      villageCount: { type: Number },
    },

    // Related content counts (populated at runtime via API)
    researchCount: { type: Number, default: 0 },
    policyCount: { type: Number, default: 0 },
    datasetCount: { type: Number, default: 0 },

    isDemoData: { type: Boolean, default: true },
    dataYear: { type: Number, default: 2024 },
    source: { type: String, default: 'Demo/Sample Data – Not official government statistics' },
  },
  { timestamps: true }
);

// Compound unique index: one record per state+district combo
GISRegionSchema.index({ state: 1, district: 1 }, { unique: true });
GISRegionSchema.index({ state: 1 });

module.exports = mongoose.model('GISRegion', GISRegionSchema);
