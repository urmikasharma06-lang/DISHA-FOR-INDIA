const { AuthenticationError, AuthorizationError } = require('../utils/errors');
const jwtUtils = require('../utils/jwt');
const User = require('../modules/user/user.model');
const { STATUS } = require('../modules/user/user.constants');

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

    // Check if user is active
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
 * Authorization middleware.
 * Restricts access to specific roles.
 * @param {...string} roles - The allowed roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError('You do not have permission to perform this action.'));
    }

    return next();
  };
};

/**
 * Optional authentication middleware.
 * Populates req.user if a valid token is present, but does not block if not.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwtUtils.verifyAccessToken(token);
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
  optionalAuth,
};
