import api from './api';

/**
 * Fetch all applications for the authenticated volunteer.
 * @param {Object} params  - Optional query params: status, search, sortBy, page, limit
 */
export const getApplications = async (params = {}) => {
  const res = await api.get('/applications', { params });
  return res; // { success, data: { applications, pagination, stats } }
};

/**
 * Fetch a single application by ID.
 * @param {string|number} id
 */
export const getApplicationById = async (id) => {
  const res = await api.get(`/applications/${id}`);
  return res; // { success, data: { application } }
};

/**
 * Submit a new application for a given program.
 * @param {string|number} programId
 * @param {Object} formData  - motivation, availability, experience, etc.
 */
export const submitApplication = async (programId, formData) => {
  const res = await api.post('/applications', { programId, ...formData });
  return res; // { success, data: { application } }
};

/**
 * Withdraw / cancel an existing application.
 * @param {string|number} id
 */
export const withdrawApplication = async (id) => {
  const res = await api.patch(`/applications/${id}/withdraw`);
  return res; // { success, data: { application } }
};

/**
 * Fetch aggregated stats (pending / approved / rejected / waitlisted).
 */
export const getApplicationStats = async () => {
  const res = await api.get('/applications/stats');
  return res; // { success, data: { pending, approved, rejected, waitlisted } }
};

export default {
  getApplications,
  getApplicationById,
  submitApplication,
  withdrawApplication,
  getApplicationStats,
};
