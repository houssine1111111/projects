'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = (authHeader.startsWith('Bearer ') && authHeader.substring(7)) || null;
    if (!token) {
      return next(new createError.Unauthorized('Missing Authorization header'));
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch (err) {
    return next(new createError.Unauthorized('Invalid or expired token'));
  }
}

function authorizeRoles(...allowed) {
  return (req, _res, next) => {
    if (!req.user) return next(new createError.Unauthorized());
    if (!allowed.includes(req.user.role)) {
      return next(new createError.Forbidden('Insufficient permissions'));
    }
    return next();
  };
}

module.exports = { authenticate, authorizeRoles };
