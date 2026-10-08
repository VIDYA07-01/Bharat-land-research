const CaseStudy = require('../models/CaseStudy');
const { AppError } = require('../middleware/errorHandler');

/* ── helpers ──────────────────────────────────────────────────────────────── */
const buildFilter = (q) => {
  const f = { status: { $in: ['approved', 'published'] } };
  if (q.state)            f['location.state']    = q.state;
  if (q.district)         f['location.district'] = q.district;
  if (q.category)         f.category             = q.category;
  if (q.climateRisk)      f.climateRiskLevel     = q.climateRisk;
  if (q.year)             f['studyPeriod.startYear'] = { $lte: +q.year };
  return f;
};

const applySearch = async (filter, searchTerm) => {
  if (!searchTerm?.trim()) return filter;

  // try text index first
  try {
    const probe = await CaseStudy.findOne({
      ...filter,
      $text: { $search: searchTerm },
    }).select('_id');
    if (probe) return { ...filter, $text: { $search: searchTerm } };
  } catch (_) {}

  // regex fallback
  const rx = new RegExp(searchTerm.split(/\s+/).join('|'), 'i');
  return {
    ...filter,
    $or: [
      { title: rx }, { problem: rx }, { background: rx },
      { tags: rx }, { category: rx }, { 'location.state': rx }, { 'location.district': rx },
    ],
  };
};

/* ── insight generator (rule-based) ──────────────────────────────────────── */
const generateInsights = (cs) => {
  if (cs.insights?.length) return cs.insights;
  const ind = cs.indicators || {};
  const out = [];
  if (ind.urbanPct > 40)           out.push(`Urban land comprises ${ind.urbanPct}% — significant built-up pressure on the region.`);
  if (ind.agriculturalPct < 30)    out.push(`Agricultural land has declined to ${ind.agriculturalPct}% — food-security risks are emerging.`);
  if (ind.climateVulnerabilityScore > 60) out.push(`Climate vulnerability score of ${ind.climateVulnerabilityScore}/100 indicates high exposure to climate shocks.`);
  if (ind.activeLandDisputes > 500) out.push(`${ind.activeLandDisputes?.toLocaleString()} active land disputes signal governance pressure.`);
  if (ind.landDegradation > 40)    out.push(`Land degradation index of ${ind.landDegradation}/100 warrants urgent soil-health intervention.`);
  if (ind.floodRisk > 65)          out.push(`Flood risk score of ${ind.floodRisk}/100 — drainage and wetland protection are critical.`);
  if (!out.length)                  out.push(`The region shows moderate land-governance pressure with opportunities for integrated digital management.`);
  return out;
};

/* ── GET /api/case-studies ──────────────────────────────────────────────── */
exports.getCaseStudies = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(24, parseInt(req.query.limit) || 9);
    const skip  = (page - 1) * limit;

    let filter = buildFilter(req.query);
    if (req.query.search) filter = await applySearch(filter, req.query.search);

    const sortMap = {
      latest:   { createdAt: -1 },
      relevant: { impactScore: -1 },
      views:    { viewCount: -1 },
      title:    { title: 1 },
    };
    const sort = sortMap[req.query.sort] || sortMap.latest;

    const [caseStudies, total] = await Promise.all([
      CaseStudy.find(filter)
        .select('title slug category subCategory location studyPeriod problem tags technologyUsed status viewCount isDemoData impactScore climateRiskLevel indicators.totalAreaHa indicators.urbanPct indicators.agriculturalPct indicators.climateVulnerabilityScore updatedAt')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      CaseStudy.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: caseStudies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: caseStudies,
    });
  } catch (err) { next(err); }
};

/* ── GET /api/case-studies/:id ──────────────────────────────────────────── */
exports.getCaseStudy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? CaseStudy.findById(id)
      : CaseStudy.findOne({ slug: id });

    const cs = await query.lean();
    if (!cs) return next(new AppError('Case study not found', 404));

    // increment view (fire-and-forget)
    CaseStudy.findByIdAndUpdate(cs._id, { $inc: { viewCount: 1 } }).exec();

    // attach generated insights
    cs.generatedInsights = generateInsights(cs);

    res.json({ success: true, data: cs });
  } catch (err) { next(err); }
};

/* ── GET /api/case-studies/state/:state ───────────────────────────────── */
exports.getCaseStudiesByState = async (req, res, next) => {
  try {
    const data = await CaseStudy.find({
      status: { $in: ['approved', 'published'] },
      'location.state': req.params.state,
    })
      .select('title slug category location studyPeriod impactScore climateRiskLevel')
      .sort('-impactScore')
      .lean();
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

/* ── GET /api/case-studies/district/:district ─────────────────────────── */
exports.getCaseStudiesByDistrict = async (req, res, next) => {
  try {
    const data = await CaseStudy.find({
      status: { $in: ['approved', 'published'] },
      'location.district': req.params.district,
    })
      .select('title slug category location studyPeriod impactScore climateRiskLevel')
      .sort('-impactScore')
      .lean();
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

/* ── GET /api/case-studies/category/:cat ──────────────────────────────── */
exports.getCaseStudiesByCategory = async (req, res, next) => {
  try {
    const data = await CaseStudy.find({
      status: { $in: ['approved', 'published'] },
      category: req.params.category,
    })
      .select('title slug category location studyPeriod impactScore climateRiskLevel')
      .sort('-impactScore')
      .lean();
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

/* ── GET /api/case-studies/search?q= ─────────────────────────────────── */
exports.searchCaseStudies = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 9 } = req.query;
    if (!q?.trim()) return next(new AppError('Query required', 400));

    const base = { status: { $in: ['approved', 'published'] } };
    const filter = await applySearch(base, q);

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const data  = await CaseStudy.find(filter)
      .select('title slug category location studyPeriod problem impactScore climateRiskLevel tags')
      .skip(skip).limit(parseInt(limit)).lean();
    const total = await CaseStudy.countDocuments(filter);

    res.json({ success: true, query: q, count: data.length, total, data });
  } catch (err) { next(err); }
};

/* ── POST /api/case-studies ──────────────────────────────────────────── */
exports.createCaseStudy = async (req, res, next) => {
  try {
    const body = { ...req.body, uploadedBy: req.user._id };
    if (req.files?.images)    body.images    = req.files.images.map((f) => f.path);
    if (req.files?.documents) body.documents = req.files.documents.map((f) => f.path);
    for (const key of ['location', 'indicators', 'landUseTrend', 'timeline', 'impacts',
      'policies', 'research', 'challenges', 'insights', 'recommendations', 'landRecords', 'gisLayers']) {
      if (body[key] && typeof body[key] === 'string') {
        try { body[key] = JSON.parse(body[key]); } catch (_) {}
      }
    }
    const cs = await CaseStudy.create(body);
    res.status(201).json({ success: true, data: cs });
  } catch (err) { next(err); }
};

/* ── PUT /api/case-studies/:id ───────────────────────────────────────── */
exports.updateCaseStudy = async (req, res, next) => {
  try {
    const cs = await CaseStudy.findById(req.params.id);
    if (!cs) return next(new AppError('Case study not found', 404));
    if (cs.uploadedBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return next(new AppError('Not authorized', 403));

    const updated = await CaseStudy.findByIdAndUpdate(req.params.id, req.body,
      { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

/* ── DELETE /api/case-studies/:id ────────────────────────────────────── */
exports.deleteCaseStudy = async (req, res, next) => {
  try {
    const cs = await CaseStudy.findById(req.params.id);
    if (!cs) return next(new AppError('Case study not found', 404));
    await cs.deleteOne();
    res.json({ success: true, message: 'Case study deleted' });
  } catch (err) { next(err); }
};

/* ── PUT /api/case-studies/:id/approve ─────────────────────────────── */
exports.approveCaseStudy = async (req, res, next) => {
  try {
    const cs = await CaseStudy.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true });
    if (!cs) return next(new AppError('Not found', 404));
    res.json({ success: true, data: cs });
  } catch (err) { next(err); }
};

/* ── GET /api/case-studies/:id/land-records ─────────────────────────── */
exports.getLandRecords = async (req, res, next) => {
  try {
    const cs = await CaseStudy.findById(req.params.id).select('landRecords title location isDemoData').lean();
    if (!cs) return next(new AppError('Not found', 404));
    res.json({
      success: true,
      disclaimer: 'DEMO/SAMPLE DATA – Not official land records. Survey numbers and owner details are fictitious.',
      caseStudy: { title: cs.title, location: cs.location },
      count: cs.landRecords?.length || 0,
      data: cs.landRecords || [],
    });
  } catch (err) { next(err); }
};

/* ── GET /api/case-studies/meta/filters ────────────────────────────── */
exports.getFilterMeta = async (req, res, next) => {
  try {
    const [states, categories, climateRisks] = await Promise.all([
      CaseStudy.distinct('location.state', { status: { $in: ['approved', 'published'] } }),
      CaseStudy.distinct('category',       { status: { $in: ['approved', 'published'] } }),
      CaseStudy.distinct('climateRiskLevel',{ status: { $in: ['approved', 'published'] } }),
    ]);
    res.json({ success: true, data: { states, categories, climateRisks } });
  } catch (err) { next(err); }
};
