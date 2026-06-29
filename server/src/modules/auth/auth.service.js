const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const authRepository = require('./auth.repository');
const { MESSAGES } = require('./auth.constants');
const { STATUS, ROLES } = require('../user/user.constants');
const User = require('../user/user.model');
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
} = require('../../utils/errors');
const jwtUtils = require('../../utils/jwt');
const passwordUtils = require('../../utils/password');

class AuthService {
  /**
   * Register a new user.
   * @param {object} userData - Registration details.
   * @returns {Promise<object>} The user, access token, and refresh token.
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

    // Hash the password
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Create the user in the database
    const user = await authRepository.create({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      role: ROLES.VOLUNTEER,
      status: STATUS.PENDING,
    });

    // Generate tokens
    const accessToken = jwtUtils.generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    // Save refresh token to user
    await authRepository.update(user._id, { refreshToken });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Log in an existing user.
   * @param {object} credentials - Login credentials (email or username, and password).
   * @returns {Promise<object>} The user, access token, and refresh token.
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

    // Generate tokens
    const accessToken = jwtUtils.generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    // Update lastLogin and refresh token
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
   * Log out a user by clearing their refresh token.
   * @param {string} userId - User ID.
   */
  async logout(userId) {
    if (!userId) return;
    await authRepository.update(userId, { refreshToken: null });
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

    let decoded;
    try {
      decoded = jwtUtils.verifyRefreshToken(token);
    } catch (_error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Find user and select refresh token
    const user = await authRepository.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      throw new AuthenticationError('Invalid refresh token or session expired');
    }

    // Generate new tokens (Token Rotation)
    const accessToken = jwtUtils.generateAccessToken({ id: user._id, role: user.role });
    const newRefreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    // Update refresh token in DB
    await authRepository.update(user._id, {
      refreshToken: newRefreshToken,
      lastActive: new Date(),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Request password reset link.
   * @param {string} email - User email.
   * @returns {Promise<object>} The reset token (to be sent via email).
   */
  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User with this email does not exist');
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetToken field
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiry to 10 minutes from now
    const resetExpires = Date.now() + 10 * 60 * 1000;

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: hashedResetToken,
      passwordResetExpires: resetExpires,
    });

    // In a real production system, you would trigger an email job here.
    // For now, we return the resetToken to allow testing/logging.
    return { resetToken };
  }

  /**
   * Reset password using a token.
   * @param {string} token - Reset token.
   * @param {string} newPassword - New password.
   */
  async resetPassword(token, newPassword) {
    // Hash the token received from the user
    const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token and not expired
    const user = await User.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ValidationError('Password reset token is invalid or has expired');
    }

    // Set new password (will be hashed)
    const hashedPassword = await passwordUtils.hashPassword(newPassword);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: MESSAGES.PASSWORD_RESET_SUCCESS };
  }

  /**
   * Authenticate or register a user via Google OAuth.
   * @param {string} googleToken - ID token from Google.
   * @returns {Promise<object>} The user, access token, and refresh token.
   */
  async googleLogin(googleToken) {
    if (!googleToken) {
      throw new ValidationError('Google ID token is required');
    }

    let payload;
    // Development/testing backdoor for mock Google logins
    if (process.env.NODE_ENV !== 'production' && googleToken.startsWith('mock_')) {
      const mockId = googleToken.replace('mock_', '');
      payload = {
        sub: `google_${mockId}`,
        email: `${mockId}@gmail.com`,
        name: `${mockId.charAt(0).toUpperCase() + mockId.slice(1)} Google`,
        picture: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      };
    } else {
      try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (_error) {
        throw new AuthenticationError('Invalid Google ID token');
      }
    }

    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists by googleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists by email (link Google account)
      user = await User.findOne({ email });

      if (user) {
        // Link Google ID to existing email
        user.googleId = googleId;
        if (!user.profilePhoto) user.profilePhoto = picture;
        user.status = STATUS.ACTIVE; // Mark active if verified via Google
        await user.save();
      } else {
        // Create a new user (Google Registration)
        // Generate a unique username from email
        const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        let username = baseUsername;
        let isUsernameTaken = await authRepository.findByUsername(username);
        let counter = 1;

        while (isUsernameTaken) {
          username = `${baseUsername}${counter}`;
          isUsernameTaken = await authRepository.findByUsername(username);
          counter++;
        }

        user = await authRepository.create({
          name,
          username,
          email,
          googleId,
          profilePhoto: picture,
          role: ROLES.VOLUNTEER,
          status: STATUS.ACTIVE, // Verification not needed for Google OAuth
        });
      }
    }

    // Generate tokens
    const accessToken = jwtUtils.generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    // Update refresh token and lastLogin
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
}

module.exports = new AuthService();
