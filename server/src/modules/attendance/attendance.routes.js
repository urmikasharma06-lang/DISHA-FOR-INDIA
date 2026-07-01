const express = require('express');
const attendanceController = require('./attendance.controller');
const {
  validateCheckIn,
  validateCheckOut,
  validateMarkAttendance,
  validateGetAttendance,
  validateMyAttendance,
  validateAttendanceHistory,
} = require('./attendance.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize, isVolunteer } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// All attendance routes require authentication
router.use(authenticate);

// ─── Volunteer Routes ──────────────────────────────────────────────
router.post('/check-in', isVolunteer, validateCheckIn, attendanceController.checkIn);
router.patch('/check-out', isVolunteer, validateCheckOut, attendanceController.checkOut);
router.get('/me', validateMyAttendance, attendanceController.getMyAttendance);

// ─── Admin / Coordinator Routes ────────────────────────────────────
router.get(
  '/history',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateAttendanceHistory,
  attendanceController.attendanceHistory
);
router.patch(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateMarkAttendance,
  attendanceController.markAttendance
);

// ─── Shared Routes ──────────────────────────────────────────────────
router.get('/:id', validateGetAttendance, attendanceController.getAttendance);

module.exports = router;
