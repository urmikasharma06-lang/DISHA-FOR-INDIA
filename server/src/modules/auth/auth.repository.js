const User = require('../user/user.model');

class AuthRepository {
  /**
   * Find a user by ID.
   * @param {string} id - User ID.
   * @returns {Promise<User|null>} The user document.
   */
  async findById(id) {
    return User.findById(id).select('+refreshToken');
  }

  /**
   * Find a user by email.
   * @param {string} email - User email.
   * @returns {Promise<User|null>} The user document.
   */
  async findByEmail(email) {
    return User.findOne({ email }).select('+password +refreshToken');
  }

  /**
   * Find a user by username.
   * @param {string} username - User username.
   * @returns {Promise<User|null>} The user document.
   */
  async findByUsername(username) {
    return User.findOne({ username }).select('+password +refreshToken');
  }

  /**
   * Find a user by volunteer ID.
   * @param {string} volunteerId - Volunteer ID.
   * @returns {Promise<User|null>} The user document.
   */
  async findByVolunteerId(volunteerId) {
    return User.findOne({ volunteerId }).select('+refreshToken');
  }

  /**
   * Find a user by their refresh token.
   * @param {string} token - The refresh token.
   * @returns {Promise<User|null>} The user document.
   */
  async findByRefreshToken(token) {
    return User.findOne({ refreshToken: token }).select('+refreshToken');
  }

  /**
   * Create a new user.
   * @param {object} userData - User data.
   * @returns {Promise<User>} The created user document.
   */
  async create(userData) {
    return User.create(userData);
  }

  /**
   * Update user details.
   * @param {string} id - User ID.
   * @param {object} updateData - Data to update.
   * @returns {Promise<User|null>} The updated user document.
   */
  async update(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('+refreshToken');
  }

  /**
   * Update the refresh token for a user.
   * @param {string} id - User ID.
   * @param {string} token - The new refresh token.
   * @returns {Promise<User|null>} The updated user document.
   */
  async updateRefreshToken(id, token) {
    return User.findByIdAndUpdate(
      id,
      { refreshToken: token },
      { new: true, runValidators: true }
    ).select('+refreshToken');
  }

  /**
   * Remove the refresh token for a user.
   * @param {string} id - User ID.
   * @returns {Promise<User|null>} The updated user document.
   */
  async removeRefreshToken(id) {
    return User.findByIdAndUpdate(
      id,
      { refreshToken: null },
      { new: true, runValidators: true }
    ).select('+refreshToken');
  }

  /**
   * Delete a user.
   * @param {string} id - User ID.
   * @returns {Promise<User|null>} The deleted user document.
   */
  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new AuthRepository();
