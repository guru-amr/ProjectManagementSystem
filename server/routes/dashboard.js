const router = require('express').Router();
const { stats } = require('../controllers/dashboardController');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard stats for logged in user
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Stats object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProjects: { type: integer }
 *                 projectsInProgress: { type: integer }
 *                 totalTasks: { type: integer }
 *                 completedTasks: { type: integer }
 *                 pendingTasks: { type: integer }
 */
router.get('/', stats);

module.exports = router;
