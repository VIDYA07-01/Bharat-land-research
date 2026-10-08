const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['public', 'researcher', 'government', 'admin'],
      default: 'public',
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [200, 'Organization name cannot exceed 200 characters'],
    },
    state: {
      type: String,
      trim: true,
    },
    designation: { type: String, trim: true },
    bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    avatar: { type: String, default: '' },
    phone: { type: String, trim: true },
    expertise: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
UserSchema.index({ role: 1 });

module.exports = mongoose.model('User', UserSchema);
