const attendanceRepository = require('./attendance.repository');
const applicationRepository = require('../application/application.repository');
const { generateAttendanceId } = require('./attendance.utils');
const { ATTENDANCE_STATUS } = require('./attendance.constants');
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  ConflictError,
} = require('../../utils/errors');

class AttendanceService {
  /**
   * Calculate total hours between check-in and check-out.
   * @param {Date|string} checkInTime
   * @param {Date|string} checkOutTime
   * @returns {number} Hours in decimal format (rounded to 2 decimal places)
   */
  calculateHours(checkInTime, checkOutTime) {
    const inTime = new Date(checkInTime);
    const outTime = new Date(checkOutTime);
    const diffMs = outTime - inTime;

    if (diffMs < 0) {
      throw new ValidationError('Check-out time cannot be before check-in time');
    }

    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 100) / 100;
  }

  /**
   * Validate if a volunteer is allowed to check in for a specific application/program.
   * @param {string} userId - User ID
   * @param {string} applicationId - Application ID
   * @returns {Promise<object>} Object containing validated application and program
   */
  async validateAttendance(userId, applicationId) {
    const application = await applicationRepository.findById(applicationId);
    if (!application || application.isDeleted) {
      throw new NotFoundError('Application not found');
    }

    // Verify application belongs to volunteer
    const appUserId = application.user._id || application.user;
    if (appUserId.toString() !== userId.toString()) {
      throw new AuthorizationError('You are not authorized to check in for this application');
    }

    // Verify application status is 'joined'
    if (application.status !== 'joined') {
      throw new ValidationError('You have not joined this program');
    }

    const program = application.program;
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    // Verify program is active/ongoing
    if (program.status !== 'ongoing') {
      throw new ValidationError('Check-in failed: Program is not currently ongoing');
    }

    return { application, program };
  }

  /**
   * Check in a volunteer for a specific program/application.
   */
  async checkIn(userId, applicationId) {
    // 1. Validate application and program
    const { application, program } = await this.validateAttendance(userId, applicationId);

    // 2. Normalize date to midnight UTC to check for duplicate check-ins today
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const programId = program._id || program;

    // 3. Prevent duplicate check-in today
    const existingAttendance = await attendanceRepository.findTodayAttendance(
      userId,
      programId,
      today
    );
    if (existingAttendance) {
      throw new ConflictError('You have already checked in for this program today');
    }

    // 4. Create check-in record
    const attendanceId = generateAttendanceId();
    const checkInRecord = await attendanceRepository.checkIn({
      attendanceId,
      user: userId,
      application: application._id,
      program: programId,
      attendanceDate: today,
      status: ATTENDANCE_STATUS.PRESENT,
      checkInTime: new Date(),
      markedBy: userId,
    });

    return checkInRecord;
  }

  /**
   * Check out a volunteer.
   */
  async checkOut(attendanceId, userId) {
    // 1. Find attendance record
    const attendance = await attendanceRepository.findByAttendanceId(attendanceId);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }

    // 2. Verify record ownership
    const attUserId = attendance.user._id || attendance.user;
    if (attUserId.toString() !== userId.toString()) {
      throw new AuthorizationError('You are not authorized to check out for this attendance');
    }

    // 3. Prevent duplicate check-out
    if (attendance.checkOutTime) {
      throw new ValidationError('You have already checked out for this attendance record');
    }

    // 4. Calculate total hours
    const checkInTime = attendance.checkInTime;
    const checkOutTime = new Date();
    const totalHours = this.calculateHours(checkInTime, checkOutTime);

    // 5. Update checkout fields
    const updatedRecord = await attendanceRepository.checkOut(
      attendance._id,
      checkOutTime,
      totalHours
    );
    return updatedRecord;
  }

  /**
   * Manually mark attendance (Admin/Coordinator) - Skeleton.
   */
  async markAttendance(adminId, data) {
    return { adminId, data, message: 'Mark attendance skeleton' };
  }

  /**
   * Get details of a specific attendance record - Skeleton.
   */
  async getAttendance(attendanceId) {
    const attendance = await attendanceRepository.findById(attendanceId);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }
    return attendance;
  }

  /**
   * Get the attendance summary for the currently logged-in volunteer - Skeleton.
   */
  async getMyAttendance(userId, queryParams) {
    return { userId, queryParams, message: 'Get my attendance skeleton' };
  }

  /**
   * Get attendance history across the platform (Admin/Coordinator) - Skeleton.
   */
  async attendanceHistory(queryParams) {
    return { queryParams, message: 'Attendance history skeleton' };
  }
}

module.exports = new AttendanceService();
