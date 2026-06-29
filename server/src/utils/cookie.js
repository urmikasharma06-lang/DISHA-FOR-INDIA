const { COOKIE_OPTIONS } = require('../modules/auth/auth.constants');

/**
 * Set the refresh token inside a secure HTTP-only cookie.
 * @param {object} res - Express response object.
 * @param {string} refreshToken - The JWT refresh token.
 */
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
};

/**
 * Clear the refresh token cookie.
 * @param {object} res - Express response object.
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
  });
};

module.exports = {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
