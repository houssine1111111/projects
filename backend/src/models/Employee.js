'use strict';

const mongoose = require('mongoose');

const employmentTypes = ['full_time', 'part_time', 'contract', 'intern', 'temporary'];
const statuses = ['active', 'inactive', 'terminated', 'on_leave'];

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  { _id: false }
);

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    relation: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, index: true },
    lastName: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    hireDate: { type: Date },
    department: { type: String, trim: true, index: true },
    position: { type: String, trim: true },
    employmentType: { type: String, enum: employmentTypes, default: 'full_time', index: true },
    status: { type: String, enum: statuses, default: 'active', index: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    address: { type: addressSchema },
    emergencyContacts: { type: [emergencyContactSchema], default: [] },
    skills: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    salary: { type: Number, min: 0 },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

employeeSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
  department: 'text',
  position: 'text',
  skills: 'text',
  tags: 'text',
});

employeeSchema.methods.toJSON = function toJSONSafe() {
  const obj = this.toObject({ virtuals: true });
  delete obj.__v;
  return obj;
};

module.exports = {
  Employee: mongoose.model('Employee', employeeSchema),
  employmentTypes,
  statuses,
};
