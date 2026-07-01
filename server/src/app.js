const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');

require('./config/passport'); // Load Passport Google OAuth strategy
const getCorsConfig = require('./config/cors.config');
const helmetConfig = require('./config/helmet.config');
const getMorganMiddleware = require('./config/morgan.config');
const { globalLimiter } = require('./config/rateLimiter.config');
const swaggerSpec = require('./config/swagger.config');
const errorHandler = require('./middlewares/error.middleware');
const notFoundHandler = require('./middlewares/notFound.middleware');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const programRoutes = require('./modules/program/program.routes');
const applicationRoutes = require('./modules/application/application.routes');
const attendanceRoutes = require('./modules/attendance/attendance.routes');
const certificateRoutes = require('./modules/certificate/certificate.routes');
const rewardRoutes = require('./modules/reward/reward.routes');
const leaderboardRoutes = require('./modules/leaderboard/leaderboard.routes');
const { successResponse } = require('./utils/response');

const app = express();

// ─────────────────────────────────────────────
// 1. Security Headers (Helmet)
// ─────────────────────────────────────────────
app.use(helmet(helmetConfig));

// ─────────────────────────────────────────────
// 2. CORS
// ─────────────────────────────────────────────
app.use(cors(getCorsConfig()));
app.options('/{*splat}', cors(getCorsConfig())); // Handle pre-flight requests for all routes

// ─────────────────────────────────────────────
// 3. HTTP Request Logging (Morgan)
// ─────────────────────────────────────────────
app.use(getMorganMiddleware());

// ─────────────────────────────────────────────
// 4. Body Parsing (with request size limits)
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─────────────────────────────────────────────
// 5. Cookie Parsing
// ─────────────────────────────────────────────
app.use(cookieParser());

// ─────────────────────────────────────────────
// 6. Gzip Compression
// ─────────────────────────────────────────────
app.use(compression());

// ─────────────────────────────────────────────
// 7. Passport Initialization
// ─────────────────────────────────────────────
app.use(passport.initialize());

// ─────────────────────────────────────────────
// 8. Global Rate Limiter (Production only)
// ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use('/api', globalLimiter);
}

// ─────────────────────────────────────────────
// 9. Health Check
// ─────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  return successResponse(res, 200, 'Server is healthy', {
    status: 'UP',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─────────────────────────────────────────────
// 10. API Routes
// ─────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

// ─────────────────────────────────────────────
// 11. Swagger API Documentation
// ─────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─────────────────────────────────────────────
// 12. 404 Handler (must be after all routes and docs)
// ─────────────────────────────────────────────
app.use(notFoundHandler);

// ─────────────────────────────────────────────
// 13. Global Error Handler (must be last)
// ─────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
