const Attendance = require('./attendance.model');

class AttendanceRepository {
  /**
   * Create a new attendance record.
   */
  async create(attendanceData) {
    return Attendance.create(attendanceData);
  }

  /**
   * Find an attendance record by its MongoDB ID.
   */
  async findById(id) {
    return Attendance.findById(id);
  }

  /**
   * Find an attendance record by its custom attendanceId.
   */
  async findByAttendanceId(attendanceId) {
    return Attendance.findOne({ attendanceId, isDeleted: false });
  }

  /**
   * Find attendance records by application ID.
   */
  async findByApplication(applicationId) {
    return Attendance.find({ application: applicationId, isDeleted: false });
  }

  /**
   * Find attendance records by program ID.
   */
  async findByProgram(programId) {
    return Attendance.find({ program: programId, isDeleted: false });
  }

  /**
   * Find attendance records by volunteer ID.
   */
  async findByVolunteer(userId) {
    return Attendance.find({ user: userId, isDeleted: false });
  }

  /**
   * Find attendance records by date.
   */
  async findByDate(date) {
    return Attendance.find({ attendanceDate: date, isDeleted: false });
  }

  /**
   * Update an attendance record.
   */
  async update(id, updateData) {
    return Attendance.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  /**
   * Soft delete an attendance record.
   */
  async softDelete(id, deletedById) {
    return Attendance.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedById,
      },
      { new: true }
    );
  }

  // ─── Module 6.2 Specific Methods ─────────────────────────────────

  /**
   * Perform volunteer check-in (saves the record).
   */
  async checkIn(attendanceData) {
    return this.create(attendanceData);
  }

  /**
   * Perform volunteer check-out by updating checkout fields.
   */
  async checkOut(id, checkOutTime, totalHours) {
    return this.update(id, { checkOutTime, totalHours });
  }

  /**
   * Find today's attendance record for a volunteer in a program.
   * Compares the normalized date (midnight UTC).
   */
  async findTodayAttendance(userId, programId, date) {
    return Attendance.findOne({
      user: userId,
      program: programId,
      attendanceDate: date,
      isDeleted: false,
    });
  }

  /**
   * Find all attendance records for a volunteer.
   */
  async findVolunteerAttendance(userId) {
    return this.findByVolunteer(userId);
  }

  /**
   * Update attendance data.
   */
  async updateAttendance(id, updateData) {
    return this.update(id, updateData);
  }
}

module.exports = new AttendanceRepository();
