const { MESSAGES, HEADERS } = require('../modules/auth/auth.constants');
const { STATUS } = require('../modules/user/user.constants');
const User = require('../modules/user/user.model');
const { AuthenticationError } = require('../utils/errors');
const jwtUtils = require('../utils/jwt');

/**
 * Authentication middleware.
 * Verifies the JWT Access Token in the Authorization header.
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check for token in Authorization header
    const authHeader = req.headers[HEADERS.AUTH_HEADER];
    if (authHeader && authHeader.startsWith(HEADERS.BEARER_PREFIX)) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(new AuthenticationError(MESSAGES.MISSING_TOKEN));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwtUtils.verifyAccessToken(token);
    } catch (_error) {
      return next(new AuthenticationError(MESSAGES.INVALID_TOKEN));
    }

    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AuthenticationError(MESSAGES.USER_NOT_FOUND));
    }

    // Check if user is active/suspended
    if (user.status === STATUS.SUSPENDED) {
      return next(new AuthenticationError(MESSAGES.BLOCKED_USER));
    }

    // Attach user to request object
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Authorization middleware.
 * Restricts access to specific roles.
 * @param {...string} roles - The allowed roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError(MESSAGES.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AuthenticationError(MESSAGES.FORBIDDEN));
    }

    return next();
  };
};

/**
 * Optional authentication middleware.
 * Populates req.user if a valid token is present, but does not block if not.
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers[HEADERS.AUTH_HEADER];
    if (authHeader && authHeader.startsWith(HEADERS.BEARER_PREFIX)) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    let decoded;
    try {
      decoded = jwtUtils.verifyAccessToken(token);
    } catch (_error) {
      return next();
    }

    const user = await User.findById(decoded.id);
    if (user && user.status !== STATUS.SUSPENDED) {
      req.user = user;
    }

    return next();
  } catch (_error) {
    // Fail silently for optional authentication
    return next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuthenticate,
};
