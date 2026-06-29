const authRepository = require('./auth.repository');
const { MESSAGES } = require('./auth.constants');
const { STATUS, ROLES } = require('../user/user.constants');
const { ConflictError, AuthenticationError, NotFoundError } = require('../../utils/errors');
const jwtUtils = require('../../utils/jwt');
const passwordUtils = require('../../utils/password');
const { generateVolunteerId } = require('../../utils/volunteerId');

class AuthService {
  /**
   * Register a new user.
   * @param {object} userData - Registration details.
   * @returns {Promise<object>} The created user.
   */
  async register(userData) {
    const { name, username, email, password, phone } = userData;

    // Check if email already exists
    const existingEmail = await authRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictError(MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Check if username already exists
    const existingUsername = await authRepository.findByUsername(username);
    if (existingUsername) {
      throw new ConflictError(MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    // Generate sequential Volunteer ID
    const volunteerId = await generateVolunteerId();

    // Hash the password
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Create the user in the database
    const user = await authRepository.create({
      volunteerId,
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      role: ROLES.VOLUNTEER,
      status: STATUS.PENDING,
    });

    return user;
  }

  /**
   * Log in an existing user.
   * @param {object} credentials - Login credentials (email or username, and password).
   * @returns {Promise<object>} The logged-in user, access token, and refresh token.
   */
  async login(credentials) {
    const { email, username, password } = credentials;
    let user = null;

    // Find user by email or username
    if (email) {
      user = await authRepository.findByEmail(email);
    } else if (username) {
      user = await authRepository.findByUsername(username);
    }

    if (!user) {
      throw new AuthenticationError(MESSAGES.INVALID_CREDENTIALS);
    }

    // Compare passwords
    const isPasswordMatch = await passwordUtils.comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw new AuthenticationError(MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify account status (Blocked/Suspended users cannot log in)
    if (user.status === STATUS.SUSPENDED) {
      throw new AuthenticationError('Your account has been suspended. Please contact support.');
    }

    // Generate tokens
    const accessToken = jwtUtils.generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    // Update login information and refresh token
    const updatedUser = await authRepository.update(user._id, {
      refreshToken,
      lastLogin: new Date(),
      lastActive: new Date(),
    });

    return {
      user: updatedUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Log out a user by removing their refresh token.
   * @param {string} userId - User ID.
   */
  async logout(userId) {
    if (!userId) {
      throw new AuthenticationError('User ID is required for logout.');
    }
    await authRepository.removeRefreshToken(userId);
  }

  /**
   * Refresh the JWT Access Token using a Refresh Token (Token Rotation).
   * @param {string} token - The refresh token.
   * @returns {Promise<object>} New access and refresh tokens.
   */
  async refreshToken(token) {
    if (!token) {
      throw new AuthenticationError('Refresh token is required');
    }

    try {
      jwtUtils.verifyRefreshToken(token);
    } catch (_error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Find user by their refresh token to verify it hasn't been rotated or revoked
    const user = await authRepository.findByRefreshToken(token);
    if (!user) {
      throw new AuthenticationError('Invalid refresh token or session expired');
    }

    // Generate new tokens (Token Rotation)
    const accessToken = jwtUtils.generateAccessToken({ id: user._id, role: user.role });
    const newRefreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    // Update refresh token in DB
    await authRepository.updateRefreshToken(user._id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Retrieve the profile of the currently logged-in user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} The user document.
   */
  async getCurrentUser(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
