const multer = require('multer');
const path = require('path');
const { AppError } = require('./errorHandler');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'document' || file.fieldname === 'file') {
      uploadPath = 'uploads/documents/';
    } else if (file.fieldname === 'image' || file.fieldname === 'images') {
      uploadPath = 'uploads/images/';
    } else if (file.fieldname === 'dataset') {
      uploadPath = 'uploads/datasets/';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedDocTypes = /pdf|doc|docx|xls|xlsx|csv|txt|json|zip/;
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;

  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (file.fieldname === 'image' || file.fieldname === 'images') {
    if (allowedImageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed (jpeg, jpg, png, gif, webp)', 400), false);
    }
  } else {
    if (allowedDocTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          'Only document files are allowed (pdf, doc, docx, xls, xlsx, csv, txt, json, zip)',
          400
        ),
        false
      );
    }
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
});

module.exports = upload;
