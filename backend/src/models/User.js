'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const validRoles = ['admin', 'manager', 'employee'];
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: validRoles,
      default: 'employee',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Virtual password setter used to hash before saving
userSchema.virtual('password').set(function setPassword(password) {
  this._password = password;
});

userSchema.pre('save', async function hashPasswordIfNeeded(next) {
  try {
    if (this.isModified('passwordHash')) {
      return next();
    }
    if (this._password) {
      const saltRounds = Number.isFinite(BCRYPT_SALT_ROUNDS) ? BCRYPT_SALT_ROUNDS : 10;
      this.passwordHash = await bcrypt.hash(this._password, saltRounds);
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toJSON = function toJSONSafe() {
  const obj = this.toObject({ virtuals: true });
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

module.exports = {
  User: mongoose.model('User', userSchema),
  validRoles,
};
