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
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(new AuthenticationError('Access token is missing. Please log in.'));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwtUtils.verifyAccessToken(token);
    } catch (_error) {
      return next(new AuthenticationError('Invalid or expired access token. Please log in again.'));
    }

    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AuthenticationError('User belonging to this token no longer exists.'));
    }

    // Check if user is active/suspended
    if (user.status === STATUS.SUSPENDED) {
      return next(
        new AuthenticationError('Your account has been suspended. Please contact support.')
      );
    }

    // Attach user to request object
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Authorization middleware skeleton (not used in Module 2.3, but kept for future use).
 */
const authorize = (..._roles) => {
  return (req, res, next) => {
    return next();
  };
};

/**
 * Optional authentication middleware skeleton.
 */
const optionalAuth = async (req, res, next) => {
  return next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
