'use strict';

const express = require('express');
const { validate } = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { registerSchema, loginSchema } = require('../validators/auth.validators');
const { registerUser, loginUser, getProfile } = require('../services/auth.service');

const router = express.Router();

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { token, user } = await registerUser(req.body);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const profile = await getProfile(req.user.id);
    res.json({ user: profile });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
