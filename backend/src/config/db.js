'use strict';

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hrm_dev';
const NODE_ENV = process.env.NODE_ENV || 'development';

let isConnecting = false;

function wait(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function setupConnectionEventLogging() {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err?.message || err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
    if (!isConnecting) {
      // Attempt to reconnect with backoff
      connectWithRetry().catch(() => {});
    }
  });
}

async function connectWithRetry(retryAttempt = 0) {
  try {
    isConnecting = true;

    await mongoose.connect(MONGODB_URI, {
      autoIndex: NODE_ENV !== 'production',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnecting = false;
    return mongoose.connection;
  } catch (error) {
    isConnecting = false;
    const delayMs = Math.min(30000, 1000 * Math.pow(2, retryAttempt));
    console.error(`MongoDB connection failed (attempt ${retryAttempt + 1}): ${error.message}`);
    console.log(`Retrying in ${delayMs}ms...`);
    await wait(delayMs);
    return connectWithRetry(retryAttempt + 1);
  }
}

async function connectToDatabase() {
  setupConnectionEventLogging();
  return connectWithRetry(0);
}

async function disconnectFromDatabase() {
  try {
    await mongoose.connection.close(false);
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err?.message || err);
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  mongoose,
};