const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all users (admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, isActive, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { organization: new RegExp(search, 'i') },
    ];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find(query).sort('-createdAt').skip(skip).limit(limit);
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role/status (admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const updateData = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError('Cannot delete your own account', 400));
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public researcher profiles
exports.getResearchers = async (req, res, next) => {
  try {
    const researchers = await User.find({ role: 'researcher', isActive: true })
      .select('name organization state expertise bio createdAt')
      .sort('-createdAt')
      .limit(20);

    res.status(200).json({ success: true, count: researchers.length, data: researchers });
  } catch (err) {
    next(err);
  }
};
