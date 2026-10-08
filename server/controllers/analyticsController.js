const Research = require('../models/Research');
const Dataset = require('../models/Dataset');
const Policy = require('../models/Policy');
const CaseStudy = require('../models/CaseStudy');
const User = require('../models/User');
const ResearchProject = require('../models/ResearchProject');

// Demo analytics data
const DEMO_LAND_USE_TRENDS = [
  { year: 2015, agricultural: 182000, urban: 28000, forest: 71000, water: 15000 },
  { year: 2016, agricultural: 180500, urban: 29200, forest: 70500, water: 14800 },
  { year: 2017, agricultural: 179000, urban: 30800, forest: 70000, water: 14600 },
  { year: 2018, agricultural: 177200, urban: 32500, forest: 69500, water: 14400 },
  { year: 2019, agricultural: 175800, urban: 34100, forest: 68800, water: 14200 },
  { year: 2020, agricultural: 174100, urban: 35900, forest: 68200, water: 14000 },
  { year: 2021, agricultural: 172500, urban: 37800, forest: 67600, water: 13800 },
  { year: 2022, agricultural: 170900, urban: 39600, forest: 67000, water: 13600 },
  { year: 2023, agricultural: 169200, urban: 41500, forest: 66400, water: 13400 },
  { year: 2024, agricultural: 167800, urban: 43200, forest: 65900, water: 13200 },
];

const DEMO_CLIMATE_DATA = [
  { state: 'Rajasthan', droughtRisk: 82, floodRisk: 18, landDegradation: 68, vulnerability: 75 },
  { state: 'Maharashtra', droughtRisk: 55, floodRisk: 48, landDegradation: 35, vulnerability: 52 },
  { state: 'Uttar Pradesh', droughtRisk: 62, floodRisk: 72, landDegradation: 58, vulnerability: 65 },
  { state: 'Karnataka', droughtRisk: 48, floodRisk: 42, landDegradation: 32, vulnerability: 45 },
  { state: 'Tamil Nadu', droughtRisk: 45, floodRisk: 65, landDegradation: 28, vulnerability: 48 },
  { state: 'Gujarat', droughtRisk: 70, floodRisk: 35, landDegradation: 52, vulnerability: 60 },
  { state: 'West Bengal', droughtRisk: 30, floodRisk: 78, landDegradation: 42, vulnerability: 55 },
  { state: 'Odisha', droughtRisk: 38, floodRisk: 82, landDegradation: 45, vulnerability: 58 },
];

const DEMO_DISPUTE_DATA = [
  { category: 'Boundary Disputes', count: 4521, pending: 2891, resolved: 1630 },
  { category: 'Ownership Disputes', count: 3876, pending: 2134, resolved: 1742 },
  { category: 'Encroachment', count: 5234, pending: 3421, resolved: 1813 },
  { category: 'Tribal Land Rights', count: 2187, pending: 1654, resolved: 533 },
  { category: 'Forest Rights', count: 1893, pending: 1245, resolved: 648 },
  { category: 'Urban Land Conversion', count: 2456, pending: 1567, resolved: 889 },
  { category: 'Acquisition Disputes', count: 1678, pending: 987, resolved: 691 },
];

const DEMO_POLICY_PERFORMANCE = [
  { policy: 'DILRMP', target: 100, achieved: 78, year: 2024 },
  { policy: 'SVAMITVA', target: 650000, achieved: 480000, year: 2024 },
  { policy: 'PM-KISAN', target: 120000000, achieved: 115000000, year: 2024 },
  { policy: 'PMAY-G', target: 2950000, achieved: 2680000, year: 2024 },
  { policy: 'MGNREGS', target: 150000000, achieved: 134000000, year: 2024 },
];

exports.getLandUseTrends = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      disclaimer: 'DEMO DATA – Not official government statistics.',
      data: DEMO_LAND_USE_TRENDS,
    });
  } catch (err) {
    next(err);
  }
};

exports.getClimateResilience = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      disclaimer: 'DEMO DATA – Not official government statistics.',
      data: DEMO_CLIMATE_DATA,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLandDisputes = async (req, res, next) => {
  try {
    const totalDisputes = DEMO_DISPUTE_DATA.reduce((acc, d) => acc + d.count, 0);
    const totalPending = DEMO_DISPUTE_DATA.reduce((acc, d) => acc + d.pending, 0);
    const totalResolved = DEMO_DISPUTE_DATA.reduce((acc, d) => acc + d.resolved, 0);

    res.status(200).json({
      success: true,
      disclaimer: 'DEMO DATA – Not official government statistics.',
      data: {
        summary: { totalDisputes, totalPending, totalResolved },
        breakdown: DEMO_DISPUTE_DATA,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getPolicyPerformance = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      disclaimer: 'DEMO DATA – Not official government statistics.',
      data: DEMO_POLICY_PERFORMANCE,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPlatformStats = async (req, res, next) => {
  try {
    const [
      totalResearch,
      totalDatasets,
      totalPolicies,
      totalCaseStudies,
      totalUsers,
      totalResearchers,
      totalGovt,
      totalProjects,
    ] = await Promise.all([
      Research.countDocuments({ status: { $in: ['approved', 'published'] } }),
      Dataset.countDocuments({ status: { $in: ['approved', 'published'] } }),
      Policy.countDocuments({ status: 'published' }),
      CaseStudy.countDocuments({ status: { $in: ['approved', 'published'] } }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'researcher', isActive: true }),
      User.countDocuments({ role: 'government', isActive: true }),
      ResearchProject.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        research: totalResearch,
        datasets: totalDatasets,
        policies: totalPolicies,
        caseStudies: totalCaseStudies,
        users: totalUsers,
        researchers: totalResearchers,
        governmentUsers: totalGovt,
        projects: totalProjects,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers, researchers, govtUsers, admins,
      totalResearch, pendingResearch,
      totalDatasets, pendingDatasets,
      totalPolicies, totalCaseStudies,
      totalProjects, activeProjects,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'researcher' }),
      User.countDocuments({ role: 'government' }),
      User.countDocuments({ role: 'admin' }),
      Research.countDocuments(),
      Research.countDocuments({ status: 'pending' }),
      Dataset.countDocuments(),
      Dataset.countDocuments({ status: 'pending' }),
      Policy.countDocuments(),
      CaseStudy.countDocuments(),
      ResearchProject.countDocuments(),
      ResearchProject.countDocuments({ status: 'active' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, researchers, governmentUsers: govtUsers, admins },
        research: { total: totalResearch, pending: pendingResearch },
        datasets: { total: totalDatasets, pending: pendingDatasets },
        policies: { total: totalPolicies },
        caseStudies: { total: totalCaseStudies },
        projects: { total: totalProjects, active: activeProjects },
      },
    });
  } catch (err) {
    next(err);
  }
};
