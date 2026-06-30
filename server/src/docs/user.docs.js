/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     description: >
 *       Returns the complete profile of the currently authenticated user.
 *       Sensitive fields such as password and refreshToken are never returned.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Update current user profile
 *     description: >
 *       Updates the profile details of the currently authenticated user.
 *       System-managed fields (email, role, status, points, etc.) cannot be updated here.
 *       Profile completion percentage is automatically recalculated on every update.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           examples:
 *             basic:
 *               summary: Basic information update
 *               value:
 *                 name: Arjun Mehta
 *                 phone: "+919876543210"
 *                 about: Passionate about social impact and education in rural India.
 *             full:
 *               summary: Full profile update
 *               value:
 *                 name: Arjun Mehta
 *                 username: arjun_mehta
 *                 phone: "+919876543210"
 *                 gender: male
 *                 dateOfBirth: "2000-04-15"
 *                 college: IIT Delhi
 *                 course: B.Tech Computer Science
 *                 graduationYear: 2022
 *                 educationLevel: Graduate
 *                 city: New Delhi
 *                 state: Delhi
 *                 country: India
 *                 about: Passionate about social impact and education in rural India.
 *                 skills:
 *                   - Teaching
 *                   - Node.js
 *                   - React
 *                 languages:
 *                   - English
 *                   - Hindi
 *                 interests:
 *                   - Education
 *                   - Environment
 *                 availability:
 *                   - Weekends
 *                   - Evenings
 *                 linkedin: https://linkedin.com/in/arjunmehta
 *                 portfolio: https://arjunmehta.dev
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalidPhone:
 *                 summary: Invalid phone number
 *                 value:
 *                   success: false
 *                   message: Profile update validation failed
 *                   errors:
 *                     - field: phone
 *                       message: Please enter a valid phone number
 *               invalidUrl:
 *                 summary: Invalid LinkedIn URL
 *                 value:
 *                   success: false
 *                   message: Profile update validation failed
 *                   errors:
 *                     - field: linkedin
 *                       message: LinkedIn must be a valid URL
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Username already taken.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Username is already taken
 *
 * /api/v1/users/profile-photo:
 *   patch:
 *     summary: Upload profile photo
 *     description: Uploads and sets the profile photo for the current authenticated user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully.
 *       401:
 *         description: Unauthorized.
 *
 * /api/v1/users/resume:
 *   patch:
 *     summary: Upload resume
 *     description: Uploads and sets the resume URL for the current authenticated user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resume uploaded successfully.
 *       401:
 *         description: Unauthorized.
 *
 * /api/v1/users/public/{username}:
 *   get:
 *     summary: Get public profile by username
 *     description: Retrieves the public-facing profile of a user by their username.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         example: arjun_mehta
 *     responses:
 *       200:
 *         description: Public profile retrieved successfully.
 *       404:
 *         description: User not found.
 *
 * /api/v1/users:
 *   get:
 *     summary: Search users (Admin/Coordinator Only)
 *     description: Search and filter users by different fields. Restricted to admins, superadmins, and coordinators.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users list retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
