/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Retrieve current user profile
 *     description: Returns the profile data of the currently authenticated user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *
 *   put:
 *     summary: Update current user profile
 *     description: Updates the profile details of the currently authenticated user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       401:
 *         description: Unauthorized.
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
