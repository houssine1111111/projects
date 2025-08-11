'use strict';

const createError = require('http-errors');
const mongoose = require('mongoose');
const { Employee } = require('../models/Employee');

function mapMongooseError(err) {
  if (err instanceof mongoose.Error.CastError) {
    return new createError.BadRequest('Invalid ID');
  }
  if (err && err.code === 11000) {
    return new createError.Conflict('Duplicate key');
  }
  return err;
}

function buildFilter(query) {
  const { search, department, status, manager, employmentType } = query;
  const filter = {};
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (employmentType) filter.employmentType = employmentType;
  if (manager) filter.manager = manager;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
      { department: regex },
      { position: regex },
      { skills: regex },
      { tags: regex },
    ];
  }
  return filter;
}

exports.createEmployee = async (req, res, next) => {
  try {
    const payload = { ...req.body, createdBy: req.user?.id };
    const employee = await Employee.create(payload);
    res.status(201).json({ employee });
  } catch (err) {
    next(mapMongooseError(err));
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const sortParam = req.query.sort || '-createdAt';
    const sort = {};
    if (sortParam.startsWith('-')) sort[sortParam.slice(1)] = -1;
    else sort[sortParam] = 1;

    const filter = buildFilter(req.query);

    const [total, data] = await Promise.all([
      Employee.countDocuments(filter),
      Employee.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      data,
      meta: { total, page, limit, pages: totalPages },
    });
  } catch (err) {
    next(mapMongooseError(err));
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) return next(new createError.NotFound('Employee not found'));
    res.json({ employee });
  } catch (err) {
    next(mapMongooseError(err));
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const updates = { ...req.body, updatedBy: req.user?.id };
    const employee = await Employee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!employee) return next(new createError.NotFound('Employee not found'));
    res.json({ employee });
  } catch (err) {
    next(mapMongooseError(err));
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const result = await Employee.findByIdAndDelete(req.params.id).lean();
    if (!result) return next(new createError.NotFound('Employee not found'));
    res.status(204).send();
  } catch (err) {
    next(mapMongooseError(err));
  }
};
