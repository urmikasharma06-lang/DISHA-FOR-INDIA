const mongoose = require('mongoose');
const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Validation for checking in.
 */
const validateCheckIn = (req, res, next) => {
  const { applicationId } = req.body;
  const errors = [];

  if (!applicationId) {
    errors.push({ field: 'applicationId', message: 'Application ID is required' });
  } else if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    errors.push({ field: 'applicationId', message: 'Invalid Application ID format' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Check-in validation failed', errors));
  }

  return next();
};

/**
 * Validation for checking out.
 */
const validateCheckOut = (req, res, next) => {
  const { attendanceId } = req.body;
  const errors = [];

  if (!attendanceId) {
    errors.push({ field: 'attendanceId', message: 'Attendance ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Check-out validation failed', errors));
  }

  return next();
};

/**
 * Validation skeleton for manually marking attendance (Admin/Coordinator).
 */
const validateMarkAttendance = (req, res, next) => {
  const { id } = req.params;
  const { status, remarks } = req.body;
  const errors = [];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push({ field: 'id', message: 'Invalid attendance ID' });
  }

  if (status && !['present', 'absent'].includes(status)) {
    errors.push({ field: 'status', message: 'Status must be either present or absent' });
  }

  if (remarks && remarks.length > 500) {
    errors.push({ field: 'remarks', message: 'Remarks cannot exceed 500 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Mark attendance validation failed', errors));
  }

  return next();
};

/**
 * Validation skeleton for getting a specific attendance record.
 */
const validateGetAttendance = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push({ field: 'id', message: 'Invalid attendance ID' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Get attendance validation failed', errors));
  }

  return next();
};

/**
 * Validation skeleton for getting my attendance.
 */
const validateMyAttendance = (req, res, next) => {
  return next();
};

/**
 * Validation skeleton for getting attendance history.
 */
const validateAttendanceHistory = (req, res, next) => {
  return next();
};

module.exports = {
  validateCheckIn,
  validateCheckOut,
  validateMarkAttendance,
  validateGetAttendance,
  validateMyAttendance,
  validateAttendanceHistory,
};
