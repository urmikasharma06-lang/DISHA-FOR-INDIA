const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = [
  'Origin',
  'X-Requested-With',
  'Content-Type',
  'Accept',
  'Authorization',
  'Cache-Control',
];

/**
 * CORS configuration factory.
 * Reads allowed origins from environment and enforces method/header allow-lists.
 */
const getCorsConfig = () => {
  const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:3000';

  // Support multiple comma-separated origins (e.g., for staging + prod)
  const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, Postman, curl)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin '${origin}' is not allowed.`), false);
    },
    credentials: true, // Allow cookies (refreshToken)
    methods: ALLOWED_METHODS,
    allowedHeaders: ALLOWED_HEADERS,
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    optionsSuccessStatus: 200, // Legacy browser support for OPTIONS pre-flight
  };
};

module.exports = getCorsConfig;
