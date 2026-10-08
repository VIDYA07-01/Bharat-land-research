const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    parameters: {
      region: { type: String, required: true },
      state: { type: String },
      landCategory: { type: String },
      policyType: { type: String },
      population: { type: Number },
      developmentLevel: { type: String },
      climateRisk: { type: String },
      timeHorizon: { type: Number, default: 10 },
    },
    scenarios: [
      {
        name: { type: String },
        description: { type: String },
        policyChanges: [{ type: String }],
        results: {
          landUseImpact: { type: Object },
          economicImpact: { type: Object },
          environmentalImpact: { type: Object },
          socialImpact: { type: Object },
          infrastructureImpact: { type: Object },
          score: { type: Number },
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'completed'],
      default: 'draft',
    },
    disclaimer: {
      type: String,
      default: 'Simulation based on demo/model data – not an official government prediction.',
    },
  },
  { timestamps: true }
);

SimulationSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Simulation', SimulationSchema);
