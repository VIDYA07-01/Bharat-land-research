const express = require('express');
const router  = express.Router();
const {
  getIndiaMap,
  getStates,
  getStateData,
  getDistricts,
  getDistrictData,
  getRegionResearch,
  getRegionPolicies,
  searchRegions,
  getMapLayers,
  getGISData,
} = require('../controllers/gisController');

// Static / utility
router.get('/india',    getIndiaMap);
router.get('/layers',   getMapLayers);
router.get('/data',     getGISData);
router.get('/states',   getStates);
router.get('/search',   searchRegions);

// State-level
router.get('/state/:stateName', getStateData);

// District-level (must come before /:state/:district)
router.get('/:state/districts', getDistricts);

// Region knowledge
router.get('/:state/:district/research', getRegionResearch);
router.get('/:state/:district/policies', getRegionPolicies);

// District data
router.get('/:state/:district', getDistrictData);

module.exports = router;
