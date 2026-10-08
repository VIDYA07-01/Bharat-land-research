const mongoose = require('mongoose');

/* ── sub-schemas ─────────────────────────────────────────────────────────────── */
const TimelineEventSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['initial', 'change', 'policy', 'event', 'current'], default: 'event' },
  landUseSnapshot: {
    agricultural: Number, urban: Number, forest: Number, water: Number, other: Number,
  },
}, { _id: false });

const IndicatorSchema = new mongoose.Schema({
  totalAreaHa: Number,
  agriculturalPct: Number,
  urbanPct: Number,
  forestPct: Number,
  waterPct: Number,
  wastelandPct: Number,
  urbanizationRate: Number,      // % per year
  climateVulnerability: { type: String, enum: ['low', 'moderate', 'high', 'very_high'] },
  climateVulnerabilityScore: Number,
  floodRisk: Number,
  droughtRisk: Number,
  landDegradation: Number,
  activeLandDisputes: Number,
  resolvedDisputes: Number,
  infrastructureProjects: Number,
  population: Number,
  populationDensity: Number,
  literacyRate: Number,
  irrigatedAreaPct: Number,
  soilHealth: { type: String, enum: ['poor', 'moderate', 'good', 'excellent'] },
}, { _id: false });

const LandUseYearSchema = new mongoose.Schema({
  year: Number,
  agricultural: Number,
  urban: Number,
  forest: Number,
  water: Number,
  wasteland: Number,
  other: Number,
}, { _id: false });

const ImpactSchema = new mongoose.Schema({
  environmental: {
    description: String,
    forestLoss: Number,        // ha
    forestGain: Number,
    waterBodyChange: Number,   // % change
    carbonEmissionChange: Number,
    biodiversityScore: Number,
  },
  economic: {
    description: String,
    agriculturalProductivityChange: Number, // %
    landValueChange: Number,
    infrastructureInvestmentCr: Number,
    jobsCreated: Number,
    gdpContribution: Number,
  },
  social: {
    description: String,
    populationAffected: Number,
    displacedFamilies: Number,
    landDisputeChange: Number,
    livelihoodImpact: String,
    accessToServicesChange: Number,
  },
  governance: {
    description: String,
    landRecordDigitizationPct: Number,
    policyImplementationScore: Number,
    adminChallenges: [String],
    disputeResolutionRate: Number,
  },
}, { _id: false });

const PolicyRefSchema = new mongoose.Schema({
  name: String,
  year: Number,
  department: String,
  objective: String,
  keyProvisions: [String],
  implementationArea: String,
  impactDescription: String,
  documentUrl: String,
  category: String,
}, { _id: false });

const ResearchRefSchema = new mongoose.Schema({
  title: String,
  authors: String,
  organization: String,
  year: Number,
  category: String,
  summary: String,
  source: String,
  url: String,
}, { _id: false });

const GISLayerSchema = new mongoose.Schema({
  id: String,
  name: String,
  color: String,
  opacity: { type: Number, default: 0.6 },
  visible: { type: Boolean, default: true },
  data: mongoose.Schema.Types.Mixed, // GeoJSON feature collection
}, { _id: false });

const LandRecordSchema = new mongoose.Schema({
  surveyNumber: String,
  ownerName: String,
  guardianName: String,
  village: String,
  taluk: String,
  district: String,
  state: String,
  areaHectares: Number,
  areaAcres: Number,
  landType: { type: String, enum: ['agricultural', 'residential', 'commercial', 'forest', 'government', 'wasteland', 'other'] },
  landUseClass: String,
  registrationNumber: String,
  registrationDate: Date,
  khasraNumber: String,
  khataNumber: String,
  mutation: String,
  encumbrances: String,
  coordinates: { lat: Number, lng: Number },
  pincode: String,
  boundaryNorth: String,
  boundarySouth: String,
  boundaryEast: String,
  boundaryWest: String,
}, { _id: false });

/* ── main schema ─────────────────────────────────────────────────────────────── */
const CaseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    slug: { type: String, trim: true, lowercase: true },
    category: { type: String, required: true },
    subCategory: { type: String },

    location: {
      state: { type: String, required: true },
      district: { type: String },
      village: { type: String },
      taluk: { type: String },
      pincode: { type: String },
      coordinates: { lat: Number, lng: Number },
      bounds: { south: Number, west: Number, north: Number, east: Number },
    },

    studyPeriod: {
      startYear: { type: Number },
      endYear: { type: Number },
    },

    // Core content
    problem: { type: String, required: true },
    background: { type: String },
    intervention: { type: String },
    methodology: { type: String },
    results: { type: String },
    lessonsLearned: { type: String },
    conclusion: { type: String },

    // Structured data
    indicators: IndicatorSchema,
    landUseTrend: [LandUseYearSchema],
    timeline: [TimelineEventSchema],
    impacts: ImpactSchema,
    policies: [PolicyRefSchema],
    research: [ResearchRefSchema],

    // Challenges & Insights
    challenges: [{
      title: String,
      description: String,
      severity: { type: String, enum: ['low', 'medium', 'high'] },
    }],
    insights: [{ type: String }],
    recommendations: [{
      priority: { type: String, enum: ['immediate', 'short_term', 'long_term'] },
      action: String,
      rationale: String,
      responsibleAgency: String,
    }],

    // GIS
    gisLayers: [GISLayerSchema],
    demoGeoJSON: mongoose.Schema.Types.Mixed,

    // Land records (for PDF generation)
    landRecords: [LandRecordSchema],

    // Tags & meta
    tags: [{ type: String, lowercase: true }],
    technologyUsed: [String],
    stakeholders: [String],
    fundingSource: String,
    images: [String],
    documents: [String],

    // Status
    status: { type: String, enum: ['pending', 'approved', 'published'], default: 'published' },
    uploadedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    viewCount: { type: Number, default: 0 },
    isDemoData: { type: Boolean, default: true },

    // Impact & relevance scores (0-100)
    impactScore: { type: Number, default: 50 },
    climateRiskLevel: { type: String, enum: ['low', 'moderate', 'high', 'very_high'], default: 'moderate' },
  },
  { timestamps: true }
);

CaseStudySchema.index({ title: 'text', problem: 'text', background: 'text', tags: 'text' });
CaseStudySchema.index({ 'location.state': 1, 'location.district': 1 });
CaseStudySchema.index({ category: 1, status: 1 });
CaseStudySchema.index({ climateRiskLevel: 1 });
CaseStudySchema.index({ slug: 1 }, { sparse: true });

module.exports = mongoose.model('CaseStudy', CaseStudySchema);
