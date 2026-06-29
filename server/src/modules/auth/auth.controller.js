const authService = require('./auth.service');
const { COOKIE_OPTIONS, MESSAGES } = require('./auth.constants');
const { successResponse } = require('../../utils/response');

class AuthController {
  /**
   * Helper to set refresh token in cookie.
   */
  #setRefreshTokenCookie(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  }

  /**
   * Helper to clear refresh token cookie.
   */
  #clearRefreshTokenCookie(res) {
    res.clearCookie('refreshToken', {
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite,
    });
  }

  register = async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body);
      this.#setRefreshTokenCookie(res, refreshToken);
      return successResponse(res, 201, MESSAGES.REGISTER_SUCCESS, { user, accessToken });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);
      this.#setRefreshTokenCookie(res, refreshToken);
      return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, { user, accessToken });
    } catch (error) {
      return next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      await authService.logout(userId);
      this.#clearRefreshTokenCookie(res);
      return successResponse(res, 200, MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      return next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken || req.body.refreshToken;
      const { accessToken, refreshToken } = await authService.refreshToken(token);
      this.#setRefreshTokenCookie(res, refreshToken);
      return successResponse(res, 200, MESSAGES.TOKEN_REFRESH_SUCCESS, { accessToken });
    } catch (error) {
      return next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return successResponse(res, 200, MESSAGES.PASSWORD_RESET_EMAIL_SENT, result);
    } catch (error) {
      return next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const result = await authService.resetPassword(token, password);
      return successResponse(res, 200, result.message);
    } catch (error) {
      return next(error);
    }
  };

  googleLogin = async (req, res, next) => {
    try {
      const { token } = req.body;
      const { user, accessToken, refreshToken } = await authService.googleLogin(token);
      this.#setRefreshTokenCookie(res, refreshToken);
      return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, { user, accessToken });
    } catch (error) {
      return next(error);
    }
  };

  getCurrentUser = async (req, res, next) => {
    try {
      // req.user is already populated with the full user object in the real authenticate middleware
      return successResponse(res, 200, 'User profile retrieved successfully', { user: req.user });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AuthController();
