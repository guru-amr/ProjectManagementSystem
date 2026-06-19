const { body } = require('express-validator');

const statusValues = ['Not Started', 'In Progress', 'Completed'];

exports.create = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('status').optional().isIn(statusValues).withMessage('Invalid status'),
  body('startDate').optional({ checkFalsy: true }).isDate().withMessage('Invalid start date'),
  body('endDate').optional({ checkFalsy: true }).isDate().withMessage('Invalid end date'),
];

exports.update = [
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
  body('status').optional().isIn(statusValues).withMessage('Invalid status'),
  body('startDate').optional({ checkFalsy: true }).isDate().withMessage('Invalid start date'),
  body('endDate').optional({ checkFalsy: true }).isDate().withMessage('Invalid end date'),
];
