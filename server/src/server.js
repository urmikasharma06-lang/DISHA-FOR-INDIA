const path = require('path');
// Load environment variables as early as possible, before any module that might read them
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Validate required environment variables — fail fast
const validateEnv = require('./utils/envValidator');
validateEnv();

const app = require('./app');
const connectDB = require('./config/db');

// ─────────────────────────────────────────────
// Handle Uncaught Exceptions (synchronous errors not caught anywhere)
// ─────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  // eslint-disable-next-line no-console
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// ─────────────────────────────────────────────
// Connect to Database
// ─────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────
// Start HTTP Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `[SERVER] 🚀 Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

// ─────────────────────────────────────────────
// Handle Unhandled Promise Rejections (async errors not caught anywhere)
// ─────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  // eslint-disable-next-line no-console
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// ─────────────────────────────────────────────
// Graceful Shutdown on SIGTERM (e.g., Heroku, Docker, Kubernetes)
// ─────────────────────────────────────────────
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('[SERVER] 📴 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('[SERVER] ✅ HTTP server closed.');
  });
});
