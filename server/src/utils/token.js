const crypto = require('crypto');

/**
 * Generate a cryptographically secure random token (in hex format) for password reset.
 * @returns {string} The unhashed token.
 */
const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash a password reset token using SHA-256 before storing it in the database.
 * @param {string} token - The raw reset token.
 * @returns {string} The hashed token.
 */
const hashPasswordResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generatePasswordResetToken,
  hashPasswordResetToken,
};
