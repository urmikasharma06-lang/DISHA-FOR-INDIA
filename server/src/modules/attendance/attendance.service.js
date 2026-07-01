const attendanceRepository = require('./attendance.repository');
const applicationRepository = require('../application/application.repository');
const Program = require('../program/program.model');
const User = require('../user/user.model');
const Attendance = require('./attendance.model');
const { generateAttendanceId } = require('./attendance.utils');
const { ATTENDANCE_STATUS } = require('./attendance.constants');
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  ConflictError,
} = require('../../utils/errors');
const ROLES = require('../../constants/roles.constants');

class AttendanceService {
  /**
   * Helper to build Mongoose query filters for attendance listings.
   */
  async _buildFilters(queryParams) {
    const { program, volunteer, status, date, startDate, endDate, city, state, search } =
      queryParams;
    const query = { isDeleted: false };

    if (program) query.program = program;
    if (volunteer) query.user = volunteer;
    if (status) query.status = status;

    if (date) {
      const targetDate = new Date(date);
      targetDate.setUTCHours(0, 0, 0, 0);
      query.attendanceDate = targetDate;
    } else if (startDate || endDate) {
      query.attendanceDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        query.attendanceDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        query.attendanceDate.$lte = end;
      }
    }

    // Filter by Program Location (City/State)
    const programQueries = { isDeleted: false };
    let hasLocationFilter = false;
    if (city) {
      programQueries.city = { $regex: city, $options: 'i' };
      hasLocationFilter = true;
    }
    if (state) {
      programQueries.state = { $regex: state, $options: 'i' };
      hasLocationFilter = true;
    }

    if (hasLocationFilter) {
      const matchingPrograms = await Program.find(programQueries).select('_id');
      const programIds = matchingPrograms.map((p) => p._id);
      query.program = { $in: programIds };
    }

    // Search by User name/email or Program title
    if (search) {
      const [users, programs] = await Promise.all([
        User.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }).select('_id'),
        Program.find({ title: { $regex: search, $options: 'i' } }).select('_id'),
      ]);
      const userIds = users.map((u) => u._id);
      const programIds = programs.map((p) => p._id);
      query.$or = [{ user: { $in: userIds } }, { program: { $in: programIds } }];
    }

    return query;
  }

  /**
   * Calculate total hours between check-in and check-out.
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
   */
  async validateAttendance(userId, applicationId) {
    const application = await applicationRepository.findById(applicationId);
    if (!application || application.isDeleted) {
      throw new NotFoundError('Application not found');
    }

    const appUserId = application.user._id || application.user;
    if (appUserId.toString() !== userId.toString()) {
      throw new AuthorizationError('You are not authorized to check in for this application');
    }

    if (application.status !== 'joined') {
      throw new ValidationError('You have not joined this program');
    }

    const program = application.program;
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    if (program.status !== 'ongoing') {
      throw new ValidationError('Check-in failed: Program is not currently ongoing');
    }

    return { application, program };
  }

  /**
   * Check in a volunteer for a specific program/application.
   */
  async checkIn(userId, applicationId) {
    const { application, program } = await this.validateAttendance(userId, applicationId);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const programId = program._id || program;

    const existingAttendance = await attendanceRepository.findTodayAttendance(
      userId,
      programId,
      today
    );
    if (existingAttendance) {
      throw new ConflictError('You have already checked in for this program today');
    }

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
    const attendance = await attendanceRepository.findByAttendanceId(attendanceId);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }

    const attUserId = attendance.user._id || attendance.user;
    if (attUserId.toString() !== userId.toString()) {
      throw new AuthorizationError('You are not authorized to check out for this attendance');
    }

    if (attendance.checkOutTime) {
      throw new ValidationError('You have already checked out for this attendance record');
    }

    const checkInTime = attendance.checkInTime;
    const checkOutTime = new Date();
    const totalHours = this.calculateHours(checkInTime, checkOutTime);

    const updatedRecord = await attendanceRepository.checkOut(
      attendance._id,
      checkOutTime,
      totalHours
    );
    return updatedRecord;
  }

  /**
   * Get attendance for currently logged in volunteer.
   */
  async getMyAttendance(userId, queryParams) {
    const { page, limit, sortBy, sortOrder, program, startDate, endDate } = queryParams;
    const filters = {};

    if (program) filters.program = program;
    if (startDate || endDate) {
      filters.attendanceDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        filters.attendanceDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        filters.attendanceDate.$lte = end;
      }
    }

    const result = await attendanceRepository.findMyAttendance(userId, filters, {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
    });
    return result;
  }

  /**
   * Get attendance details. Volunteers can view only their own. Admins can view any.
   */
  async getAttendance(attendanceId, userId, userRole) {
    const attendance = await attendanceRepository.findAttendanceById(attendanceId);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }

    const isAuthorized =
      [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR].includes(userRole) ||
      attendance.user._id.toString() === userId.toString();

    if (!isAuthorized) {
      throw new AuthorizationError('You are not authorized to view this record');
    }

    return attendance;
  }

  /**
   * Admin attendance listing.
   */
  async getAdminAttendance(queryParams) {
    const { page = 1, limit = 10, sortBy, sortOrder } = queryParams;
    const filters = await this._buildFilters(queryParams);

    const result = await attendanceRepository.findAdminAttendance(filters, {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
    });
    return result;
  }

  /**
   * Edit attendance manually (Admin only).
   */
  async editAttendance(id, updateData, adminId) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }

    const updatedFields = { ...updateData, markedBy: adminId };

    if (updateData.status === ATTENDANCE_STATUS.ABSENT) {
      updatedFields.checkInTime = null;
      updatedFields.checkOutTime = null;
      updatedFields.totalHours = 0;
    } else {
      const inTime = updateData.checkInTime
        ? new Date(updateData.checkInTime)
        : attendance.checkInTime;
      const outTime = updateData.checkOutTime
        ? new Date(updateData.checkOutTime)
        : attendance.checkOutTime;

      if (inTime && outTime) {
        updatedFields.totalHours = this.calculateHours(inTime, outTime);
      }
    }

    const updated = await attendanceRepository.updateAttendance(id, updatedFields);
    return updated;
  }

  /**
   * Bulk mark/update attendance (Admin only).
   */
  async bulkAttendance(adminId, bulkData) {
    const { ids, status, remarks } = bulkData;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ValidationError('A non-empty array of attendance IDs is required');
    }

    const updateData = { markedBy: adminId };
    if (status) {
      updateData.status = status;
      if (status === ATTENDANCE_STATUS.ABSENT) {
        updateData.totalHours = 0;
        updateData.checkInTime = null;
        updateData.checkOutTime = null;
      }
    }
    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    await attendanceRepository.bulkUpdateAttendance(ids, updateData);
    return { count: ids.length };
  }

  /**
   * Get attendance statistics (Admin only).
   */
  async getStatistics() {
    return attendanceRepository.getAttendanceStatistics();
  }

  /**
   * Export attendance data in simplified format (Admin only).
   */
  async exportAttendance(queryParams) {
    const filters = await this._buildFilters(queryParams);
    const records = await Attendance.find(filters)
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId')
      .sort({ attendanceDate: -1 });

    const exportData = records.map((r) => ({
      'Attendance ID': r.attendanceId,
      'Attendance Date': r.attendanceDate ? r.attendanceDate.toISOString().split('T')[0] : 'N/A',
      'Volunteer Name': r.user?.name || 'N/A',
      'Volunteer Email': r.user?.email || 'N/A',
      'Volunteer ID': r.user?.volunteerId || 'N/A',
      'Program Title': r.program?.title || 'N/A',
      'Program ID': r.program?.programId || 'N/A',
      Status: r.status,
      'Check-in Time': r.checkInTime ? r.checkInTime.toISOString() : 'N/A',
      'Check-out Time': r.checkOutTime ? r.checkOutTime.toISOString() : 'N/A',
      'Total Hours': r.totalHours,
      Remarks: r.remarks || '',
    }));

    return exportData;
  }
}

module.exports = new AttendanceService();
