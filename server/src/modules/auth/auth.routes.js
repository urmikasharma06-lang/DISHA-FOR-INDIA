const express = require('express');
const authController = require('./auth.controller');
const validateForgotPassword = require('./forgotPassword.validation');
const validateLogin = require('./login.validation');
const validateRegister = require('./register.validation');
const validateResetPassword = require('./resetPassword.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.post('/reset-password/:token', validateResetPassword, authController.resetPassword);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
