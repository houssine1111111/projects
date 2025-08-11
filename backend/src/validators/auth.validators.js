'use strict';

const Joi = require('joi');
const { validRoles } = require('../models/User');

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid(...validRoles).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(128).required(),
});

module.exports = { registerSchema, loginSchema };
