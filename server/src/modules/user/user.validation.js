const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Validation skeleton for getting current profile.
 */
const validateGetCurrentProfile = (req, res, next) => {
  // SKELETON: No validation logic needed for fetching own profile
  return next();
};

/**
 * Validation skeleton for updating profile.
 */
const validateUpdateProfile = (req, res, next) => {
  const errors = [];
  const { name, phone } = req.body;

  if (name !== undefined && name.trim() === '') {
    errors.push({ field: 'name', message: 'Name cannot be empty' });
  }

  if (phone !== undefined) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (phone.trim() !== '' && !phoneRegex.test(phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Profile update validation failed', errors));
  }

  return next();
};

/**
 * Validation skeleton for uploading profile photo.
 */
const validateUploadProfilePhoto = (req, res, next) => {
  // SKELETON: Photo upload validation skeleton
  return next();
};

/**
 * Validation skeleton for uploading resume.
 */
const validateUploadResume = (req, res, next) => {
  // SKELETON: Resume upload validation skeleton
  return next();
};

/**
 * Validation skeleton for retrieving public profile.
 */
const validatePublicProfile = (req, res, next) => {
  const { username } = req.params;
  const errors = [];

  if (!username || username.trim() === '') {
    errors.push({ field: 'username', message: 'Username parameter is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Public profile validation failed', errors));
  }

  return next();
};

/**
 * Validation skeleton for admin searching users.
 */
const validateAdminUserSearch = (req, res, next) => {
  // SKELETON: User search validation skeleton
  return next();
};

module.exports = {
  validateGetCurrentProfile,
  validateUpdateProfile,
  validateUploadProfilePhoto,
  validateUploadResume,
  validatePublicProfile,
  validateAdminUserSearch,
};
