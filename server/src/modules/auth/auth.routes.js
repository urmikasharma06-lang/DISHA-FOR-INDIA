const express = require('express');
const authController = require('./auth.controller');
const validateForgotPassword = require('./forgotPassword.validation');
const validateLogin = require('./login.validation');
const validateRegister = require('./register.validation');
const validateResetPassword = require('./resetPassword.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { isAdmin, isVolunteer, isAdminOrVolunteer } = require('../../middlewares/rbac.middleware');
const { authLimiter, forgotPasswordLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

// Public routes with rate limiting
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  validateForgotPassword,
  authController.forgotPassword
);
router.post('/reset-password/:token', validateResetPassword, authController.resetPassword);

// Google OAuth routes
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

// RBAC Demonstration routes
router.get('/test/public-blogs', (req, res) => {
  return res.status(200).json({ success: true, message: 'Public blogs accessed successfully.' });
});

router.get('/test/profile', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Authenticated user profile accessed successfully.',
    user: req.user,
  });
});

router.post('/test/admin-programs', authenticate, isAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Admin programs route accessed successfully.',
  });
});

router.post('/test/volunteer-applications', authenticate, isVolunteer, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Volunteer applications route accessed successfully.',
  });
});

router.get('/test/notifications', authenticate, isAdminOrVolunteer, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Notifications route accessed by Admin/Volunteer successfully.',
  });
});

module.exports = router;
