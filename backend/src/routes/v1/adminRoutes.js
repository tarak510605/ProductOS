const express = require('express');
const { getAllUsers, deleteAllUsers } = require('../../controllers/adminController');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden for non-admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/v1/admin/users:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete all users except current admin (admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users deleted
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden for non-admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/users', deleteAllUsers);

module.exports = router;
