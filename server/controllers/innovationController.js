const Innovation = require('../models/Innovation');
const { AppError } = require('../middleware/errorHandler');
const APIFeatures = require('../utils/apiFeatures');

exports.getInnovations = async (req, res, next) => {
  try {
    const baseQuery = {};
    if (req.query.type) baseQuery.type = req.query.type;
    if (req.query.status) baseQuery.status = req.query.status;
    if (req.query.state) baseQuery.state = req.query.state;

    let query = Innovation.find(baseQuery);

    if (req.query.search) {
      query = Innovation.find({ ...baseQuery, $text: { $search: req.query.search } });
    }

    const features = new APIFeatures(query, req.query).sort().limitFields().paginate();
    const innovations = await features.query;
    const total = await Innovation.countDocuments(baseQuery);

    res.status(200).json({
      success: true,
      count: innovations.length,
      total,
      totalPages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      currentPage: parseInt(req.query.page) || 1,
      data: innovations,
    });
  } catch (err) {
    next(err);
  }
};

exports.getInnovation = async (req, res, next) => {
  try {
    const innovation = await Innovation.findById(req.params.id).populate('createdBy', 'name organization');
    if (!innovation) return next(new AppError('Innovation opportunity not found', 404));
    await Innovation.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.status(200).json({ success: true, data: innovation });
  } catch (err) {
    next(err);
  }
};

exports.createInnovation = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };
    if (req.body.tags && typeof req.body.tags === 'string') {
      data.tags = req.body.tags.split(',').map((t) => t.trim());
    }
    const innovation = await Innovation.create(data);
    res.status(201).json({ success: true, data: innovation });
  } catch (err) {
    next(err);
  }
};

exports.updateInnovation = async (req, res, next) => {
  try {
    const innovation = await Innovation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!innovation) return next(new AppError('Innovation not found', 404));
    res.status(200).json({ success: true, data: innovation });
  } catch (err) {
    next(err);
  }
};

exports.deleteInnovation = async (req, res, next) => {
  try {
    const innovation = await Innovation.findById(req.params.id);
    if (!innovation) return next(new AppError('Innovation not found', 404));
    await innovation.deleteOne();
    res.status(200).json({ success: true, message: 'Innovation deleted' });
  } catch (err) {
    next(err);
  }
};
