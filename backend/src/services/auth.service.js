'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { User } = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

function generateToken(user) {
  const payload = {
    sub: String(user._id),
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function sanitizeUser(user) {
  if (!user) return null;
  const u = user.toJSON ? user.toJSON() : user;
  return {
    id: String(u._id || u.id),
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

async function registerUser({ email, password, firstName, lastName, role }) {
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    throw new createError.Conflict('Email already in use');
  }
  const user = new User({ email, firstName, lastName, role });
  user.password = password; // triggers hash via virtual + pre-save
  await user.save();
  const token = generateToken(user);
  return { token, user: sanitizeUser(user) };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !user.isActive) {
    throw new createError.Unauthorized('Invalid credentials');
  }
  const isValid = await user.validatePassword(password);
  if (!isValid) {
    throw new createError.Unauthorized('Invalid credentials');
  }
  const token = generateToken(user);
  return { token, user: sanitizeUser(user) };
}

async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw new createError.NotFound('User not found');
  return sanitizeUser(user);
}

module.exports = {
  generateToken,
  sanitizeUser,
  registerUser,
  loginUser,
  getProfile,
};
