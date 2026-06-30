const userRepository = require('./user.repository');
const { calculateProfileCompletion } = require('./profileCompletion.util');
const NotFoundError = require('../../utils/errors/NotFoundError');

class UserService {
  /**
   * Get current user's profile.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} The user profile data.
   */
  async getCurrentProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return { user };
  }

  /**
   * Update user profile.
   * @param {string} userId - User ID.
   * @param {object} updateData - Data to update.
   * @returns {Promise<object>} SKELETON return.
   */
  async updateProfile(userId, updateData) {
    // SKELETON: Logic is not implemented in Module 3.1
    return { userId, updateData };
  }

  /**
   * Upload user profile photo.
   * @param {string} userId - User ID.
   * @param {object} file - File upload object.
   * @returns {Promise<object>} SKELETON return.
   */
  async uploadProfilePhoto(userId, file) {
    // SKELETON: Logic is not implemented in Module 3.1
    return { userId, file };
  }

  /**
   * Upload user resume.
   * @param {string} userId - User ID.
   * @param {object} file - File upload object.
   * @returns {Promise<object>} SKELETON return.
   */
  async uploadResume(userId, file) {
    // SKELETON: Logic is not implemented in Module 3.1
    return { userId, file };
  }

  /**
   * Get public profile of a user by username.
   * @param {string} username - User username.
   * @returns {Promise<object>} The public user profile.
   */
  async getPublicProfile(username) {
    const user = await userRepository.findPublicProfile(username);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return { user };
  }

  /**
   * Search/list users for admin.
   * @param {object} query - Search queries.
   * @param {object} options - Pagination/sorting options.
   * @returns {Promise<object>} SKELETON return.
   */
  async searchUsers(query, options) {
    // SKELETON: Logic is not implemented in Module 3.1
    return { query, options };
  }

  /**
   * Calculate profile completion score.
   * @param {object} user - User document.
   * @returns {number} Completion percentage.
   */
  calculateProfileCompletion(user) {
    return calculateProfileCompletion(user);
  }
}

module.exports = new UserService();
