import api from './api';

/**
 * Fetch the list of programs the authenticated volunteer has joined / enrolled in.
 */
export const getJoinedPrograms = async () => {
  const res = await api.get('/programs/joined');
  return res; // { success, data: { programs } }
};

/**
 * Fetch a single joined program's details by ID.
 * @param {string|number} id
 */
export const getJoinedProgramById = async (id) => {
  const res = await api.get(`/programs/joined/${id}`);
  return res; // { success, data: { program } }
};

/**
 * Fetch all publicly browseable programs (used on the explore page).
 * @param {Object} params - category, search, page, limit, sortBy
 */
export const getPrograms = async (params = {}) => {
  const res = await api.get('/programs', { params });
  return res; // { success, data: { programs, pagination } }
};

/**
 * Fetch volunteer hours stats (total, this month, streak days, …).
 */
export const getVolunteerHours = async () => {
  const res = await api.get('/programs/hours');
  return res; // { success, data: { totalHours, monthlyHours, streak, ... } }
};

export default {
  getJoinedPrograms,
  getJoinedProgramById,
  getPrograms,
  getVolunteerHours,
};
