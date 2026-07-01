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
   * GET /api/v1/attendance/:id
   * Get details of a specific attendance record.
   */
  getAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.getAttendance(
        req.params.id,
        req.user.id,
        req.user.role
      );
      return successResponse(res, 200, MESSAGES.ATTENDANCE_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ─── Admin Controller Actions ─────────────────────────────────────

  /**
   * GET /api/v1/admin/attendance
   * List all attendance records with pagination, filtering, search and sorting.
   */
  getAdminAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.getAdminAttendance(req.query);
      return successResponse(res, 200, MESSAGES.ATTENDANCE_LIST_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /api/v1/admin/attendance/:id
   * Edit an attendance record manually.
   */
  editAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.editAttendance(req.params.id, req.body, req.user.id);
      return successResponse(res, 200, MESSAGES.ATTENDANCE_MARKED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * POST /api/v1/admin/attendance/bulk
   * Bulk update status, remarks for multiple attendance records.
   */
  bulkAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.bulkAttendance(req.user.id, req.body);
      return successResponse(res, 200, MESSAGES.ATTENDANCE_MARKED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/admin/attendance/statistics
   * Get attendance aggregate statistics.
   */
  getStatistics = async (req, res, next) => {
    try {
      const result = await attendanceService.getStatistics();
      return successResponse(res, 200, 'Attendance statistics retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/admin/attendance/export
   * Export all attendance data.
   */
  exportAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.exportAttendance(req.query);
      return successResponse(res, 200, 'Attendance data exported successfully', result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AttendanceController();
