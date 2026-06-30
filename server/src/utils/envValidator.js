/**
 * Validates required environment variables at server startup.
 * Fails fast if any required variable is missing.
 */
const REQUIRED_ENV_VARS = [
  'PORT',
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRE',
  'CORS_ORIGIN',
];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `[ENV ERROR] ❌ Missing required environment variables:\n  ${missing.join('\n  ')}\n\nPlease set them in your .env file and restart the server.`
    );
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log('[ENV] ✅ All required environment variables are present.');
};

module.exports = validateEnv;
