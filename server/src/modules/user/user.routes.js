const express = require('express');
const userController = require('./user.controller');
const {
  validateGetCurrentProfile,
  validateUpdateProfile,
  validateUploadProfilePhoto,
  validateUploadResume,
  validatePublicProfile,
  validateAdminUserSearch,
} = require('./user.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// Protected profile routes
router.get('/me', authenticate, validateGetCurrentProfile, userController.getCurrentProfile);
router.put('/me', authenticate, validateUpdateProfile, userController.updateProfile);
router.patch(
  '/profile-photo',
  authenticate,
  validateUploadProfilePhoto,
  userController.uploadProfilePhoto
);
router.patch('/resume', authenticate, validateUploadResume, userController.uploadResume);

// Public profile route
router.get('/public/:username', validatePublicProfile, userController.getPublicProfile);

// Admin/Coordinator user search route
router.get(
  '/',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateAdminUserSearch,
  userController.searchUsers
);

module.exports = router;
