'use strict';

const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createEmployeeSchema, updateEmployeeSchema } = require('../validators/employee.validators');
const ctrl = require('../controllers/employees.controller');

const router = express.Router();

// List with pagination and filtering
router.get('/', authenticate, ctrl.getEmployees);

// Get by id
router.get('/:id', authenticate, ctrl.getEmployeeById);

// Create employee (admin/manager)
router.post('/', authenticate, authorizeRoles('admin', 'manager'), validate(createEmployeeSchema), ctrl.createEmployee);

// Update employee (admin/manager)
router.patch('/:id', authenticate, authorizeRoles('admin', 'manager'), validate(updateEmployeeSchema), ctrl.updateEmployee);

// Delete employee (admin/manager)
router.delete('/:id', authenticate, authorizeRoles('admin', 'manager'), ctrl.deleteEmployee);

module.exports = router;
