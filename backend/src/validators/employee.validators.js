'use strict';

const Joi = require('joi');
const { employmentTypes, statuses } = require('../models/Employee');

const address = Joi.object({
  street: Joi.string().allow('', null),
  city: Joi.string().allow('', null),
  state: Joi.string().allow('', null),
  zip: Joi.string().allow('', null),
  country: Joi.string().allow('', null),
});

const emergencyContact = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  relation: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  email: Joi.string().email().lowercase().allow('', null),
});

const base = {
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email().lowercase(),
  phone: Joi.string().max(30),
  dateOfBirth: Joi.date().iso(),
  hireDate: Joi.date().iso(),
  department: Joi.string().max(100),
  position: Joi.string().max(100),
  employmentType: Joi.string().valid(...employmentTypes),
  status: Joi.string().valid(...statuses),
  manager: Joi.string().hex().length(24),
  address,
  emergencyContacts: Joi.array().items(emergencyContact),
  skills: Joi.array().items(Joi.string().max(100)),
  tags: Joi.array().items(Joi.string().max(50)),
  salary: Joi.number().min(0),
  notes: Joi.string().max(2000),
};

const createEmployeeSchema = Joi.object({
  ...base,
  firstName: base.firstName.required(),
  lastName: base.lastName.required(),
  email: base.email.required(),
});

const updateEmployeeSchema = Joi.object(base).min(1);

module.exports = { createEmployeeSchema, updateEmployeeSchema };
