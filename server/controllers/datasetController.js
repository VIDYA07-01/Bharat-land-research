const Dataset = require('../models/Dataset');
const { AppError } = require('../middleware/errorHandler');

exports.getDatasets = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip  = (page - 1) * limit;

    // ── Build filter ─────────────────────────────────────────────────────────
    const filter = { status: { $in: ['approved', 'published'] } };

    if (req.query.state)      filter.state      = req.query.state;
    if (req.query.category)   filter.category   = req.query.category;
    if (req.query.dataFormat) filter.dataFormat  = req.query.dataFormat;

    // ── Search: $text → regex fallback ───────────────────────────────────────
    if (req.query.search && req.query.search.trim()) {
      const term = req.query.search.trim();

      // Try MongoDB full-text search first
      let textResults = [];
      try {
        textResults = await Dataset.find({
          ...filter,
          $text: { $search: term },
        })
          .populate('uploadedBy', 'name organization')
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit)
          .lean();
      } catch (_) { /* index not ready */ }

      if (textResults.length > 0) {
        const total = await Dataset.countDocuments({
          ...filter,
          $text: { $search: term },
        });
        return res.status(200).json({
          success: true,
          count: textResults.length,
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          data: textResults,
        });
      }

      // Regex fallback — works regardless of index
      const regex = new RegExp(term.split(/\s+/).join('|'), 'i');
      filter.$or = [
        { name:         regex },
        { description:  regex },
        { tags:         regex },
        { organization: regex },
        { source:       regex },
        { state:        regex },
        { category:     regex },
        { geographicCoverage: regex },
      ];
    }

    // ── Execute ───────────────────────────────────────────────────────────────
    const [datasets, total] = await Promise.all([
      Dataset.find(filter)
        .populate('uploadedBy', 'name organization')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Dataset.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: datasets.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: datasets,
    });
  } catch (err) {
    next(err);
  }
};

exports.getDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findById(req.params.id)
      .populate('uploadedBy', 'name organization');
    if (!dataset) return next(new AppError('Dataset not found', 404));
    await Dataset.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.status(200).json({ success: true, data: dataset });
  } catch (err) {
    next(err);
  }
};

exports.createDataset = async (req, res, next) => {
  try {
    const datasetData = { ...req.body, uploadedBy: req.user._id };
    if (req.file) {
      datasetData.file = req.file.path;
      datasetData.fileOriginalName = req.file.originalname;
      datasetData.fileSize = req.file.size;
    }
    if (req.body.tags && typeof req.body.tags === 'string') {
      datasetData.tags = req.body.tags.split(',').map((t) => t.trim());
    }
    const dataset = await Dataset.create(datasetData);
    res.status(201).json({ success: true, data: dataset });
  } catch (err) {
    next(err);
  }
};

exports.updateDataset = async (req, res, next) => {
  try {
    let dataset = await Dataset.findById(req.params.id);
    if (!dataset) return next(new AppError('Dataset not found', 404));
    if (dataset.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }
    if (req.file) {
      req.body.file = req.file.path;
      req.body.fileOriginalName = req.file.originalname;
    }
    dataset = await Dataset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: dataset });
  } catch (err) {
    next(err);
  }
};

exports.deleteDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return next(new AppError('Dataset not found', 404));
    await dataset.deleteOne();
    res.status(200).json({ success: true, message: 'Dataset deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getMyDatasets = async (req, res, next) => {
  try {
    const datasets = await Dataset.find({ uploadedBy: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: datasets.length, data: datasets });
  } catch (err) {
    next(err);
  }
};

exports.downloadDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!dataset) return next(new AppError('Dataset not found', 404));
    res.status(200).json({ success: true, data: { downloadUrl: dataset.file } });
  } catch (err) {
    next(err);
  }
};

exports.approveDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!dataset) return next(new AppError('Dataset not found', 404));
    res.status(200).json({ success: true, data: dataset });
  } catch (err) {
    next(err);
  }
};
