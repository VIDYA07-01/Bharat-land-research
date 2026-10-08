const express = require('express');
const router = express.Router();
const Research = require('../models/Research');
const Dataset = require('../models/Dataset');
const Policy = require('../models/Policy');
const CaseStudy = require('../models/CaseStudy');

// @desc    Global search across all content types
// @route   GET /api/search
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { q, type, state, category, year, page = 1, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Query must be at least 2 characters' });
    }

    const searchRegex = new RegExp(q, 'i');
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = {};

    if (!type || type === 'research') {
      results.research = await Research.find({
        status: { $in: ['approved', 'published'] },
        $or: [{ title: searchRegex }, { abstract: searchRegex }, { keywords: searchRegex }],
        ...(state && { state }),
        ...(category && { category }),
        ...(year && { publicationYear: parseInt(year) }),
      })
        .select('title authors institution publicationYear category state abstract')
        .skip(skip)
        .limit(parseInt(limit));
    }

    if (!type || type === 'datasets') {
      results.datasets = await Dataset.find({
        status: { $in: ['approved', 'published'] },
        $or: [{ name: searchRegex }, { description: searchRegex }],
        ...(state && { state }),
        ...(category && { category }),
      })
        .select('name description category state year dataFormat')
        .skip(skip)
        .limit(parseInt(limit));
    }

    if (!type || type === 'policies') {
      results.policies = await Policy.find({
        status: 'published',
        $or: [{ name: searchRegex }, { description: searchRegex }, { keywords: searchRegex }],
        ...(state && { state }),
        ...(category && { category }),
      })
        .select('name department category state year implementationStatus')
        .skip(skip)
        .limit(parseInt(limit));
    }

    if (!type || type === 'casestudies') {
      results.caseStudies = await CaseStudy.find({
        status: { $in: ['approved', 'published'] },
        $or: [{ title: searchRegex }, { problem: searchRegex }],
        ...(state && { 'location.state': state }),
      })
        .select('title location category tags')
        .skip(skip)
        .limit(parseInt(limit));
    }

    const totalResults =
      (results.research?.length || 0) +
      (results.datasets?.length || 0) +
      (results.policies?.length || 0) +
      (results.caseStudies?.length || 0);

    res.status(200).json({
      success: true,
      query: q,
      totalResults,
      data: results,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
