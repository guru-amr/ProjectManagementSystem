const router = require('express').Router();
const ctrl = require('../controllers/taskController');
const validate = require('../middleware/validate');
const { create, update } = require('../validators/task');

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for logged in user
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Pending, In Progress, Completed] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [Low, Medium, High] }
 *       - in: query
 *         name: projectId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of tasks }
 */
router.get('/', ctrl.list);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Task object }
 *       404: { description: Task not found }
 */
router.get('/:id', ctrl.get);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, name]
 *             properties:
 *               projectId: { type: integer }
 *               name: { type: string }
 *               description: { type: string }
 *               priority: { type: string, enum: [Low, Medium, High] }
 *               status: { type: string, enum: [Pending, In Progress, Completed] }
 *               dueDate: { type: string, format: date }
 *     responses:
 *       201: { description: Task created }
 *       400: { description: Validation error }
 */
router.post('/', validate(create), ctrl.create);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task (use status Completed to quick-complete)
 *     tags: [Tasks]
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
 *               priority: { type: string, enum: [Low, Medium, High] }
 *               status: { type: string, enum: [Pending, In Progress, Completed] }
 *               dueDate: { type: string, format: date }
 *     responses:
 *       200: { description: Task updated }
 *       404: { description: Task not found }
 */
router.put('/:id', validate(update), ctrl.update);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Task not found }
 */
router.delete('/:id', ctrl.remove);

module.exports = router;
