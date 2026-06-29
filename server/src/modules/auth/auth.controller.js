const authService = require('./auth.service');
const { MESSAGES } = require('./auth.constants');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../../utils/cookie');
const { successResponse } = require('../../utils/response');

class AuthController {
  register = async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      return successResponse(res, 201, MESSAGES.REGISTER_SUCCESS, { user });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);
      setRefreshTokenCookie(res, refreshToken);
      return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, { user, accessToken });
    } catch (error) {
      return next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const userId = req.user.id;
      await authService.logout(userId);
      clearRefreshTokenCookie(res);
      return successResponse(res, 200, MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      return next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken;
      const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(token);
      setRefreshTokenCookie(res, newRefreshToken);
      return successResponse(res, 200, MESSAGES.TOKEN_REFRESH_SUCCESS, { accessToken });
    } catch (error) {
      return next(error);
    }
  };

  getCurrentUser = async (req, res, next) => {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return successResponse(res, 200, 'User profile retrieved successfully', { user });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AuthController();
