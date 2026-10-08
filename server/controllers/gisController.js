const path = require('path');
const fs   = require('fs');
const GISRegion = require('../models/GISRegion');

// ─── Load GeoJSON from disk ───────────────────────────────────────────────────
const loadJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return null;
  }
};

const GEO_DIR = path.join(__dirname, '../geojson');

// @desc  Get India states GeoJSON
// @route GET /api/gis/india
exports.getIndiaMap = (req, res) => {
  const data = loadJSON(path.join(GEO_DIR, 'india_states.json'));
  res.status(200).json({
    success: true,
    disclaimer: 'DEMO GeoData – Simplified boundaries for prototype only. NOT official cadastral boundaries.',
    data: data || { type: 'FeatureCollection', features: [] },
  });
};

// @desc  List all available states
// @route GET /api/gis/states
exports.getStates = async (req, res, next) => {
  try {
    const states = await GISRegion.find({ district: null })
      .select('state center bounds adminInfo demographics.population landUse.totalArea climate.vulnerability')
      .sort('state')
      .lean();
    res.status(200).json({ success: true, count: states.length, data: states });
  } catch (err) { next(err); }
};

// @desc  Get state-level data (rich, from GISRegion model)
// @route GET /api/gis/state/:stateName
exports.getStateData = async (req, res, next) => {
  try {
    const { stateName } = req.params;

    // Try GISRegion first
    let region = await GISRegion.findOne({ state: stateName, district: null }).lean();

    if (region) {
      // Flatten for frontend convenience
      const d = region;
      return res.status(200).json({
        success: true,
        disclaimer: 'DEMO/SAMPLE DATA – Not official government statistics.',
        data: {
          state:                 d.state,
          totalArea:             d.landUse?.totalArea,
          agriculturalArea:      d.landUse?.agricultural,
          urbanArea:             d.landUse?.urban,
          forestArea:            d.landUse?.forest,
          waterArea:             d.landUse?.water,
          wasteland:             d.landUse?.wasteland,
          population:            d.demographics?.population,
          populationDensity:     d.demographics?.populationDensity,
          literacyRate:          d.demographics?.literacyRate,
          climateRiskLevel:      d.climate?.vulnerability,
          droughtRisk:           d.climate?.droughtRisk,
          floodRisk:             d.climate?.floodRisk,
          heatRisk:              d.climate?.heatRisk,
          landDegradation:       d.climate?.landDegradation,
          annualRainfallMm:      d.climate?.annualRainfallMm,
          activeLandDisputes:    d.disputes?.total,
          pendingDisputes:       d.disputes?.pending,
          resolvedDisputes:      d.disputes?.resolved,
          landUseChangePercent:  d.landUseChanges?.[0]?.percentChange,
          infrastructureScore:   d.infrastructure?.infrastructureScore,
          roadsKm:               d.infrastructure?.roadsKm,
          railwaysKm:            d.infrastructure?.railwaysKm,
          activeProjects:        d.infrastructure?.activeProjects,
          hospitals:             d.infrastructure?.hospitals,
          researchCount:         d.researchCount,
          policyCount:           d.policyCount,
          datasetCount:          d.datasetCount,
          majorCrops:            d.agriculture?.majorCrops,
          irrigatedAreaPct:      d.agriculture?.irrigatedAreaPct,
          soilHealth:            d.agriculture?.soilHealth,
          adminInfo:             d.adminInfo,
          demographics:          d.demographics,
          agriculture:           d.agriculture,
          urbanization:          d.urbanization,
          landUseChanges:        d.landUseChanges,
          center:                d.center,
          bounds:                d.bounds,
          isDemoData:            true,
          source:                d.source,
        },
      });
    }

    // Fallback: generate plausible demo data for states not in DB
    const fallback = {
      state: stateName,
      totalArea:            Math.floor(Math.random() * 200000) + 50000,
      agriculturalArea:     Math.floor(Math.random() * 80000)  + 20000,
      urbanArea:            Math.floor(Math.random() * 15000)  + 3000,
      forestArea:           Math.floor(Math.random() * 25000)  + 5000,
      waterArea:            Math.floor(Math.random() * 8000)   + 1000,
      population:           Math.floor(Math.random() * 40000000) + 5000000,
      climateRiskLevel:     ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
      droughtRisk:          Math.floor(Math.random() * 60) + 20,
      floodRisk:            Math.floor(Math.random() * 60) + 20,
      landDegradation:      Math.floor(Math.random() * 50) + 10,
      activeLandDisputes:   Math.floor(Math.random() * 400)  + 50,
      landUseChangePercent: parseFloat((Math.random() * 15 + 3).toFixed(1)),
      infrastructureScore:  Math.floor(Math.random() * 35) + 50,
      researchCount:        Math.floor(Math.random() * 30) + 3,
      policyCount:          Math.floor(Math.random() * 12) + 2,
      isDemoData:           true,
      source:               'Demo/Sample Data – Not official government statistics',
    };
    res.status(200).json({ success: true, disclaimer: 'DEMO DATA', data: fallback });
  } catch (err) { next(err); }
};

// @desc  List districts for a state
// @route GET /api/gis/:state/districts
exports.getDistricts = async (req, res, next) => {
  try {
    const state = decodeURIComponent(req.params.state);
    const districts = await GISRegion.find({ state, district: { $ne: null } })
      .select('state district center bounds adminInfo landUse.totalArea climate.vulnerability')
      .sort('district')
      .lean();

    // Also try to load GeoJSON for the state
    const geoFile = path.join(GEO_DIR, 'districts', `${state.toLowerCase().replace(/\s+/g, '_')}.json`);
    const geoJSON = loadJSON(geoFile);

    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts,
      geoJSON: geoJSON || null,
    });
  } catch (err) { next(err); }
};

// @desc  Get district-level data
// @route GET /api/gis/:state/:district
exports.getDistrictData = async (req, res, next) => {
  try {
    const state    = decodeURIComponent(req.params.state);
    const district = decodeURIComponent(req.params.district);

    const region = await GISRegion.findOne({ state, district }).lean();
    if (!region) {
      return res.status(404).json({ success: false, error: 'District data not found' });
    }

    const d = region;
    res.status(200).json({
      success: true,
      disclaimer: 'DEMO/SAMPLE DATA – Not official government statistics.',
      data: {
        state: d.state, district: d.district,
        totalArea:          d.landUse?.totalArea,
        agriculturalArea:   d.landUse?.agricultural,
        urbanArea:          d.landUse?.urban,
        forestArea:         d.landUse?.forest,
        waterArea:          d.landUse?.water,
        population:         d.demographics?.population,
        climateRiskLevel:   d.climate?.vulnerability,
        droughtRisk:        d.climate?.droughtRisk,
        floodRisk:          d.climate?.floodRisk,
        landDegradation:    d.climate?.landDegradation,
        activeLandDisputes: d.disputes?.total,
        pendingDisputes:    d.disputes?.pending,
        infrastructureScore: d.infrastructure?.infrastructureScore,
        activeProjects:     d.infrastructure?.activeProjects,
        infrastructure:     d.infrastructure,
        disputes:           d.disputes,
        demographics:       d.demographics,
        agriculture:        d.agriculture,
        adminInfo:          d.adminInfo,
        urbanization:       d.urbanization,
        landUseChanges:     d.landUseChanges,
        center:             d.center,
        bounds:             d.bounds,
        researchCount:      d.researchCount,
        policyCount:        d.policyCount,
        isDemoData:         true,
      },
    });
  } catch (err) { next(err); }
};

// @desc  Related research for a region
// @route GET /api/gis/:state/:district/research
exports.getRegionResearch = async (req, res, next) => {
  try {
    const Research = require('../models/Research');
    const state    = decodeURIComponent(req.params.state);
    const district = req.params.district !== 'null' ? decodeURIComponent(req.params.district) : null;

    const query = {
      status: { $in: ['approved', 'published'] },
      $or: [{ state }, { district }].filter(Boolean),
    };
    const research = await Research.find(query)
      .select('title authors institution publicationYear category abstract viewCount downloadCount')
      .sort('-viewCount')
      .limit(6)
      .lean();

    res.status(200).json({ success: true, count: research.length, data: research });
  } catch (err) { next(err); }
};

// @desc  Related policies for a region
// @route GET /api/gis/:state/:district/policies
exports.getRegionPolicies = async (req, res, next) => {
  try {
    const Policy = require('../models/Policy');
    const state  = decodeURIComponent(req.params.state);

    const policies = await Policy.find({
      status: 'published',
      $or: [{ state }, { state: 'National' }],
    })
      .select('name department category state year implementationStatus')
      .sort('-year')
      .limit(6)
      .lean();

    res.status(200).json({ success: true, count: policies.length, data: policies });
  } catch (err) { next(err); }
};

// @desc  Search states/districts
// @route GET /api/gis/search?q=
exports.searchRegions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Query required' });

    const regex = new RegExp(q, 'i');
    const results = await GISRegion.find({
      $or: [{ state: regex }, { district: regex }],
    })
      .select('state district center adminInfo.region')
      .limit(10)
      .lean();

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) { next(err); }
};

// @desc  Map layers list
// @route GET /api/gis/layers
exports.getMapLayers = (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 'agricultural', name: 'Agricultural Land',    color: '#22c55e', opacity: 0.6 },
      { id: 'urban',        name: 'Urban Land',            color: '#f97316', opacity: 0.6 },
      { id: 'forest',       name: 'Forest Cover',          color: '#15803d', opacity: 0.7 },
      { id: 'water',        name: 'Water Bodies',          color: '#3b82f6', opacity: 0.7 },
      { id: 'climate',      name: 'Climate Vulnerability', color: '#f59e0b', opacity: 0.6 },
      { id: 'disputes',     name: 'Land Disputes',         color: '#ef4444', opacity: 0.5 },
      { id: 'infra',        name: 'Infrastructure',        color: '#8b5cf6', opacity: 0.5 },
      { id: 'change',       name: 'Land Use Change',       color: '#06b6d4', opacity: 0.6 },
    ],
  });
};

// @desc  Stored GIS data
// @route GET /api/gis/data
exports.getGISData = async (req, res, next) => {
  try {
    const { state } = req.query;
    const q = {};
    if (state) q.state = state;
    const data = await GISRegion.find(q).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};
