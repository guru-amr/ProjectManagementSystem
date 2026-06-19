const { Op } = require('sequelize');
const { Task, Project } = require('../models');

// Verify task belongs to requesting user via project ownership
const findOwnedTask = async (taskId, userId) => {
  return Task.findOne({
    where: { id: taskId },
    include: [{ model: Project, where: { userId }, required: true }],
  });
};

exports.list = async (req, res, next) => {
  try {
    const { search, status, priority, projectId } = req.query;
    const taskWhere = {};
    const projectWhere = { userId: req.user.id };

    if (search) taskWhere.name = { [Op.like]: `%${search}%` };
    if (status) taskWhere.status = status;
    if (priority) taskWhere.priority = priority;
    if (projectId) taskWhere.projectId = projectId;

    const tasks = await Task.findAll({
      where: taskWhere,
      include: [{ model: Project, where: projectWhere, required: true, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(tasks);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { projectId, name, description, priority, status, dueDate } = req.body;
    const project = await Project.findOne({ where: { id: projectId, userId: req.user.id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const task = await Task.create({ projectId, name, description, priority, status, dueDate });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const { name, description, priority, status, dueDate } = req.body;
    await task.update({ name, description, priority, status, dueDate });
    res.json(task);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.status(204).end();
  } catch (err) { next(err); }
};
