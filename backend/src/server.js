require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const { connectToDatabase, disconnectFromDatabase } = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employees.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// 404 handler
app.use((_req, _res, next) => {
  next(new createError.NotFound('Route not found'));
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
  };
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
});

const PORT = process.env.PORT || 4000;
let server;

connectToDatabase()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`HRM backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to MongoDB:', err);
    process.exit(1);
  });

const shutdown = () => {
  console.log('Shutting down gracefully...');
  if (server) {
    server.close(() => {
      disconnectFromDatabase().finally(() => process.exit(0));
    });
  } else {
    disconnectFromDatabase().finally(() => process.exit(0));
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
