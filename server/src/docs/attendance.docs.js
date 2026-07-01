/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Volunteer Attendance Management
 *
 * /api/v1/attendance/check-in:
 *   post:
 *     summary: Volunteer Check-In
 *     description: >
 *       Allows an authenticated volunteer to check in for a program they have joined.
 *       The program must be currently active (ongoing), and only one check-in is allowed per volunteer per program per day.
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [applicationId]
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: MongoDB ID of the volunteer's application for the program
 *                 example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       201:
 *         description: Checked in successfully.
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
 *                   example: Checked in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     attendanceId:
 *                       type: string
 *                       example: ATD-20231012-ABC12
 *                     user:
 *                       type: string
 *                       example: 665f1b2c3d4e5f6789abcdef
 *                     application:
 *                       type: string
 *                       example: 665f1b2c3d4e5f6789abcdef
 *                     program:
 *                       type: string
 *                       example: 665f1b2c3d4e5f6789abcdef
 *                     attendanceDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-12T00:00:00.000Z"
 *                     status:
 *                       type: string
 *                       example: present
 *                     checkInTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-12T09:00:00.000Z"
 *                     markedBy:
 *                       type: string
 *                       example: 665f1b2c3d4e5f6789abcdef
 *       400:
 *         description: Validation failed (e.g. invalid format, program not ongoing, user not joined).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden (e.g. only volunteers can check in, or unauthorized application).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict (e.g. duplicate check-in today).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/attendance/check-out:
 *   patch:
 *     summary: Volunteer Check-Out
 *     description: >
 *       Allows an authenticated volunteer to check out. This will record the check-out time
 *       and automatically calculate the total volunteer hours worked.
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [attendanceId]
 *             properties:
 *               attendanceId:
 *                 type: string
 *                 description: The unique string ID (attendanceId) of the active check-in record
 *                 example: ATD-20231012-ABC12
 *     responses:
 *       200:
 *         description: Checked out successfully.
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
 *                   example: Checked out successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     attendanceId:
 *                       type: string
 *                       example: ATD-20231012-ABC12
 *                     user:
 *                       type: string
 *                       example: 665f1b2c3d4e5f6789abcdef
 *                     application:
 *                       type: string
 *                       example: 665f1b2c3d4e5f6789abcdef
 *                     program:
 *                       type: string
 *                       example: 665f1b2c3d4e5f6789abcdef
 *                     attendanceDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-12T00:00:00.000Z"
 *                     status:
 *                       type: string
 *                       example: present
 *                     checkInTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-12T09:00:00.000Z"
 *                     checkOutTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-12T13:30:00.000Z"
 *                     totalHours:
 *                       type: number
 *                       example: 4.5
 *                     markedBy:
 *                       type: string
 *                       example: 665f1b2c3d4e5f6789abcdef
 *       400:
 *         description: Validation failed (e.g. checkout already completed, invalid time order).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden (e.g. only volunteers can check out, or unauthorized record).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Attendance record not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
