import api from './api';

/**
 * Fetch the attendance dashboard summary for the authenticated volunteer.
 * Returns streak, total sessions, monthly breakdown, etc.
 */
export const getAttendanceDashboard = async () => {
  const res = await api.get('/attendance/dashboard');
  return res; // { success, data: { ... dashboard fields } }
};

/**
 * Fetch paginated attendance history records.
 * @param {Object} params - program, dateRange, status, month, page, limit
 */
export const getAttendanceHistory = async (params = {}) => {
  const res = await api.get('/attendance/history', { params });
  return res; // { success, data: { records, pagination } }
};

/**
 * Check in to a program session.
 * @param {string|number} programId
 */
export const checkIn = async (programId) => {
  const res = await api.post('/attendance/check-in', { programId });
  return res; // { success, data: { attendanceId, checkInTime } }
};

/**
 * Check out from an active session.
 * @param {string|number} attendanceId  - ID returned by checkIn
 */
export const checkOut = async (attendanceId) => {
  const res = await api.patch(`/attendance/${attendanceId}/check-out`);
  return res; // { success, data: { attendance } }
};

export default {
  getAttendanceDashboard,
  getAttendanceHistory,
  checkIn,
  checkOut,
};
