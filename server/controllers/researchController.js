const Research = require('../models/Research');
const Bookmark = require('../models/Bookmark');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all research papers
// @route   GET /api/research
// @access  Public
exports.getResearchList = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip  = (page - 1) * limit;

    // ── Build base filter ───────────────────────────────────────────────────
    const filter = { status: { $in: ['approved', 'published'] } };

    if (req.query.state)    filter.state    = req.query.state;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.year)     filter.publicationYear = parseInt(req.query.year, 10);

    // ── Search: try $text first, fall back to regex ─────────────────────────
    if (req.query.search && req.query.search.trim()) {
      const term = req.query.search.trim();

      // Attempt MongoDB full-text search
      let textResults = [];
      try {
        textResults = await Research.find({
          ...filter,
          $text: { $search: term },
        })
          .populate('uploadedBy', 'name organization')
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit)
          .lean();
      } catch (_) {
        // text index not ready — fall through to regex
      }

      // If text search returned results, use them
      if (textResults.length > 0) {
        const total = await Research.countDocuments({
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

      // Regex fallback — works even without a text index
      const regex = new RegExp(term.split(/\s+/).join('|'), 'i');
      filter.$or = [
        { title:       regex },
        { abstract:    regex },
        { keywords:    regex },
        { institution: regex },
        { 'authors.name': regex },
        { state:       regex },
      ];
    }

    // ── Execute query ───────────────────────────────────────────────────────
    const [research, total] = await Promise.all([
      Research.find(filter)
        .populate('uploadedBy', 'name organization')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Research.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: research.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: research,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single research paper
// @route   GET /api/research/:id
// @access  Public
exports.getResearch = async (req, res, next) => {
  try {
    const research = await Research.findById(req.params.id)
      .populate('uploadedBy', 'name organization email')
      .populate('relatedPolicies', 'name category year')
      .populate('relatedDatasets', 'name category year');

    if (!research) {
      return next(new AppError('Research not found', 404));
    }

    if (!['approved', 'published'].includes(research.status)) {
      if (!req.user || (req.user._id.toString() !== research.uploadedBy._id.toString() && req.user.role !== 'admin')) {
        return next(new AppError('Research not found', 404));
      }
    }

    // Increment view count
    await Research.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.status(200).json({ success: true, data: research });
  } catch (err) {
    next(err);
  }
};

// @desc    Create research paper
// @route   POST /api/research
// @access  Private (researcher+)
exports.createResearch = async (req, res, next) => {
  try {
    const researchData = { ...req.body, uploadedBy: req.user._id };

    if (req.file) {
      researchData.document = req.file.path;
      researchData.documentOriginalName = req.file.originalname;
    }

    if (req.body.authors && typeof req.body.authors === 'string') {
      researchData.authors = JSON.parse(req.body.authors);
    }
    if (req.body.keywords && typeof req.body.keywords === 'string') {
      researchData.keywords = req.body.keywords.split(',').map((k) => k.trim());
    }

    const research = await Research.create(researchData);

    res.status(201).json({ success: true, data: research });
  } catch (err) {
    next(err);
  }
};

// @desc    Update research paper
// @route   PUT /api/research/:id
// @access  Private (owner or admin)
exports.updateResearch = async (req, res, next) => {
  try {
    let research = await Research.findById(req.params.id);

    if (!research) {
      return next(new AppError('Research not found', 404));
    }

    if (research.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this research', 403));
    }

    if (req.file) {
      req.body.document = req.file.path;
      req.body.documentOriginalName = req.file.originalname;
    }

    research = await Research.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: research });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete research paper
// @route   DELETE /api/research/:id
// @access  Private (admin)
exports.deleteResearch = async (req, res, next) => {
  try {
    const research = await Research.findById(req.params.id);

    if (!research) {
      return next(new AppError('Research not found', 404));
    }

    await research.deleteOne();

    res.status(200).json({ success: true, message: 'Research deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve/reject research
// @route   PUT /api/research/:id/approve
// @access  Private (admin)
exports.approveResearch = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;

    const research = await Research.findByIdAndUpdate(
      req.params.id,
      { status, reviewNotes, reviewedBy: req.user._id },
      { new: true }
    ).populate('uploadedBy');

    if (!research) {
      return next(new AppError('Research not found', 404));
    }

    // Create notification for uploader
    await Notification.create({
      recipient: research.uploadedBy._id,
      type: status === 'approved' ? 'research_approved' : 'research_rejected',
      title: `Research ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your research "${research.title}" has been ${status}. ${reviewNotes ? `Notes: ${reviewNotes}` : ''}`,
      link: `/research/${research._id}`,
      relatedItem: research._id,
      relatedModel: 'Research',
      sender: req.user._id,
    });

    res.status(200).json({ success: true, data: research });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my research (uploader)
// @route   GET /api/research/my
// @access  Private
exports.getMyResearch = async (req, res, next) => {
  try {
    const research = await Research.find({ uploadedBy: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: research.length, data: research });
  } catch (err) {
    next(err);
  }
};

// @desc    Download research - increment counter
// @route   GET /api/research/:id/download
// @access  Public
exports.downloadResearch = async (req, res, next) => {
  try {
    const research = await Research.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!research) return next(new AppError('Research not found', 404));

    res.status(200).json({ success: true, data: { downloadUrl: research.document } });
  } catch (err) {
    next(err);
  }
};

// @desc    Get pending research for admin
// @route   GET /api/research/pending
// @access  Private (admin)
exports.getPendingResearch = async (req, res, next) => {
  try {
    const research = await Research.find({ status: 'pending' })
      .populate('uploadedBy', 'name email organization')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: research.length, data: research });
  } catch (err) {
    next(err);
  }
};
