const express = require('express');
const applicationController = require('./application.controller');
const {
  validateApplyToProgram,
  validateWithdrawApplication,
  validateGetApplication,
  validateMyApplications,
  validateMyPrograms,
  validateAdminApplications,
  validateBulkUpdate,
} = require('./application.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// ─── Volunteer Routes ──────────────────────────────────────────────
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Invalid file type'), false);
  }
}); // temporary storage before moving

router.post(
  '/',
  authenticate,
  authorize(ROLES.VOLUNTEER, ROLES.COORDINATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  upload.array('documents', 5), // up to 5 files per application
  validateApplyToProgram,
  applicationController.applyToProgram
);

router.get('/me', authenticate, validateMyApplications, applicationController.getMyApplications);

router.patch(
  '/:id/withdraw',
  authenticate,
  validateWithdrawApplication,
  applicationController.withdrawApplication
);

// ─── Shared Routes ───────────────────────────────────────────────────
router.get('/:id', authenticate, validateGetApplication, applicationController.getApplication);

// Admin export route
router.get('/admin/applications/export', authenticate, authorize(ROLES.ADMIN, ROLES.COORDINATOR), applicationController.exportApplications);

module.exports = router;
