const router = require('express').Router();
const ctrl = require('../controllers/projectController');
const validate = require('../middleware/validate');
const { create, update } = require('../validators/project');

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for logged in user
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Not Started, In Progress, Completed] }
 *     responses:
 *       200: { description: List of projects }
 */
router.get('/', ctrl.list);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a single project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Project object }
 *       404: { description: Project not found }
 */
router.get('/:id', ctrl.get);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [Not Started, In Progress, Completed] }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *     responses:
 *       201: { description: Project created }
 *       400: { description: Validation error }
 */
router.post('/', validate(create), ctrl.create);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [Not Started, In Progress, Completed] }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *     responses:
 *       200: { description: Project updated }
 *       404: { description: Project not found }
 */
router.put('/:id', validate(update), ctrl.update);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project and all its tasks
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Project not found }
 */
router.delete('/:id', ctrl.remove);

module.exports = router;
