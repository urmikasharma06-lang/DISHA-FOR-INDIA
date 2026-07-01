const attendanceService = require('./attendance.service');
const { MESSAGES } = require('./attendance.constants');
const { successResponse } = require('../../utils/response');

class AttendanceController {
  /**
   * POST /api/v1/attendance/check-in
   * Check in a volunteer.
   */
  checkIn = async (req, res, next) => {
    try {
      const result = await attendanceService.checkIn(req.user.id, req.body.applicationId);
      return successResponse(res, 201, MESSAGES.CHECK_IN_SUCCESS, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /api/v1/attendance/check-out
   * Check out a volunteer.
   */
  checkOut = async (req, res, next) => {
    try {
      const result = await attendanceService.checkOut(req.body.attendanceId, req.user.id);
      return successResponse(res, 200, MESSAGES.CHECK_OUT_SUCCESS, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /api/v1/attendance/:id
   * Manually mark attendance (Admin/Coordinator).
   */
  markAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.markAttendance(req.user.id, {
        id: req.params.id,
        ...req.body,
      });
      return successResponse(res, 200, MESSAGES.ATTENDANCE_MARKED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/attendance/me
   * Get attendance for the currently logged-in volunteer.
   */
  getMyAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.getMyAttendance(req.user.id, req.query);
      return successResponse(res, 200, MESSAGES.ATTENDANCE_LIST_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/attendance/history
   * Get attendance history across all programs (Admin/Coordinator).
   */
  attendanceHistory = async (req, res, next) => {
    try {
      const result = await attendanceService.attendanceHistory(req.query);
      return successResponse(res, 200, MESSAGES.ATTENDANCE_LIST_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/attendance/:id
   * Get details of a specific attendance record.
   */
  getAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.getAttendance(req.params.id);
      return successResponse(res, 200, MESSAGES.ATTENDANCE_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AttendanceController();
