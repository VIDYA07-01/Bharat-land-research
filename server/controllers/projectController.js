const ResearchProject = require('../models/ResearchProject');
const { AppError } = require('../middleware/errorHandler');

exports.getProjects = async (req, res, next) => {
  try {
    const query = { $or: [{ owner: req.user._id }, { 'members.user': req.user._id }] };
    if (req.user.role === 'admin') {
      delete query.$or;
    }
    const projects = await ResearchProject.find(query)
      .populate('owner', 'name email organization')
      .populate('members.user', 'name email')
      .sort('-updatedAt');

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

exports.getPublicProjects = async (req, res, next) => {
  try {
    const projects = await ResearchProject.find({ isPublic: true, status: { $in: ['active', 'completed'] } })
      .populate('owner', 'name organization')
      .sort('-updatedAt')
      .limit(20);

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await ResearchProject.findById(req.params.id)
      .populate('owner', 'name email organization avatar')
      .populate('members.user', 'name email organization avatar')
      .populate('datasets', 'name category year');

    if (!project) return next(new AppError('Project not found', 404));

    const isMember =
      project.owner._id.toString() === req.user._id.toString() ||
      project.members.some((m) => m.user._id.toString() === req.user._id.toString()) ||
      req.user.role === 'admin';

    if (!isMember && !project.isPublic) {
      return next(new AppError('Not authorized to view this project', 403));
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const data = { ...req.body, owner: req.user._id };

    if (req.body.objectives && typeof req.body.objectives === 'string') {
      data.objectives = req.body.objectives.split(',').map((o) => o.trim());
    }

    const project = await ResearchProject.create(data);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await ResearchProject.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    const updated = await ResearchProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await ResearchProject.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

exports.addProjectNote = async (req, res, next) => {
  try {
    const project = await ResearchProject.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    project.notes.push({ content: req.body.content, author: req.user._id });
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.inviteMember = async (req, res, next) => {
  try {
    const project = await ResearchProject.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    if (project.owner.toString() !== req.user._id.toString()) {
      return next(new AppError('Only project owner can invite members', 403));
    }

    project.invitations.push({
      email: req.body.email,
      invitedBy: req.user._id,
    });
    await project.save();

    res.status(200).json({ success: true, message: 'Invitation sent', data: project });
  } catch (err) {
    next(err);
  }
};
