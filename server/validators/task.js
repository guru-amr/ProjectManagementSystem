const { body } = require('express-validator');

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'In Progress', 'Completed'];

exports.create = [
  body('projectId').isInt({ gt: 0 }).withMessage('Valid projectId is required'),
  body('name').trim().notEmpty().withMessage('Task name is required'),
  body('priority').optional().isIn(priorities).withMessage('Invalid priority'),
  body('status').optional().isIn(statuses).withMessage('Invalid status'),
  body('dueDate').optional({ checkFalsy: true }).isDate().withMessage('Invalid due date'),
];

exports.update = [
  body('name').optional().trim().notEmpty().withMessage('Task name cannot be empty'),
  body('priority').optional().isIn(priorities).withMessage('Invalid priority'),
  body('status').optional().isIn(statuses).withMessage('Invalid status'),
  body('dueDate').optional({ checkFalsy: true }).isDate().withMessage('Invalid due date'),
];
