'use strict';

const createError = require('http-errors');

function validate(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
      convert: true,
    });
    if (error) {
      const details = error.details.map((d) => ({ message: d.message, path: d.path }));
      return next(new createError.BadRequest('Validation error', { details }));
    }
    req.body = value;
    return next();
  };
}

module.exports = { validate };
