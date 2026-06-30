/**
 * Utility to calculate user profile completion percentage.
 * @param {object} user - The user object.
 * @returns {number} Completion percentage (0 to 100).
 */
const calculateProfileCompletion = (user) => {
  if (!user) {
    return 0;
  }

  let score = 0;

  // 1. Name (10%)
  if (user.name && user.name.trim() !== '') {
    score += 10;
  }

  // 2. Phone (10%)
  if (user.phone && user.phone.trim() !== '') {
    score += 10;
  }

  // 3. About (10%)
  if (user.about && user.about.trim() !== '') {
    score += 10;
  }

  // 4. Skills (10%)
  if (user.skills && user.skills.length > 0) {
    score += 10;
  }

  // 5. Languages (10%)
  if (user.languages && user.languages.length > 0) {
    score += 10;
  }

  // 6. College (10%)
  if (user.college && user.college.trim() !== '') {
    score += 10;
  }

  // 7. Course (10%)
  if (user.course && user.course.trim() !== '') {
    score += 10;
  }

  // 8. Resume (10%)
  if (user.resume && user.resume.trim() !== '') {
    score += 10;
  }

  // 9. Profile Photo (10%)
  if (user.profilePhoto && user.profilePhoto.trim() !== '') {
    score += 10;
  }

  // 10. Availability (10%)
  if (user.availability && user.availability.length > 0) {
    score += 10;
  }

  return score;
};

module.exports = {
  calculateProfileCompletion,
};
