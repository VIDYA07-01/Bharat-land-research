const Policy = require('../models/Policy');
const { AppError } = require('../middleware/errorHandler');
const APIFeatures = require('../utils/apiFeatures');

exports.getPolicies = async (req, res, next) => {
  try {
    const baseQuery = { status: 'published' };
    if (req.query.state) baseQuery.state = req.query.state;
    if (req.query.category) baseQuery.category = req.query.category;
    if (req.query.department) baseQuery.department = new RegExp(req.query.department, 'i');
    if (req.query.year) baseQuery.year = parseInt(req.query.year);

    let query = Policy.find(baseQuery).populate('uploadedBy', 'name');

    if (req.query.search) {
      query = Policy.find({
        ...baseQuery,
        $text: { $search: req.query.search },
      }).populate('uploadedBy', 'name');
    }

    const features = new APIFeatures(query, req.query).sort().limitFields().paginate();
    const policies = await features.query;
    const total = await Policy.countDocuments(baseQuery);

    res.status(200).json({
      success: true,
      count: policies.length,
      total,
      totalPages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      currentPage: parseInt(req.query.page) || 1,
      data: policies,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPolicy = async (req, res, next) => {
  try {
    const policy = await Policy.findById(req.params.id)
      .populate('relatedResearch', 'title authors publicationYear')
      .populate('relatedDatasets', 'name category year');

    if (!policy) return next(new AppError('Policy not found', 404));

    await Policy.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.status(200).json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
};

exports.createPolicy = async (req, res, next) => {
  try {
    const policyData = { ...req.body, uploadedBy: req.user._id };

    if (req.file) {
      policyData.document = req.file.path;
      policyData.documentOriginalName = req.file.originalname;
    }

    if (req.body.keywords && typeof req.body.keywords === 'string') {
      policyData.keywords = req.body.keywords.split(',').map((k) => k.trim());
    }
    if (req.body.keyFeatures && typeof req.body.keyFeatures === 'string') {
      policyData.keyFeatures = JSON.parse(req.body.keyFeatures);
    }

    const policy = await Policy.create(policyData);
    res.status(201).json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
};

exports.updatePolicy = async (req, res, next) => {
  try {
    let policy = await Policy.findById(req.params.id);
    if (!policy) return next(new AppError('Policy not found', 404));

    if (req.file) {
      req.body.document = req.file.path;
      req.body.documentOriginalName = req.file.originalname;
    }

    policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
};

exports.deletePolicy = async (req, res, next) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return next(new AppError('Policy not found', 404));
    await policy.deleteOne();
    res.status(200).json({ success: true, message: 'Policy deleted' });
  } catch (err) {
    next(err);
  }
};

exports.comparePolicy = async (req, res, next) => {
  try {
    const { ids } = req.query;
    if (!ids) return next(new AppError('Please provide policy IDs to compare', 400));

    const policyIds = ids.split(',').slice(0, 3);
    const policies = await Policy.find({ _id: { $in: policyIds } });

    res.status(200).json({ success: true, count: policies.length, data: policies });
  } catch (err) {
    next(err);
  }
};
