const express = require('express');
const authController = require('./auth.controller');
const validateLogin = require('./login.validation');
const validateRegister = require('./register.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
