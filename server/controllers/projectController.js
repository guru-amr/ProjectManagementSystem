const { Op } = require('sequelize');
const { Project } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (search) where.name = { [Op.like]: `%${search}%` };
    const projects = await Project.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(projects);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, status, startDate, endDate } = req.body;
    const project = await Project.create({ userId: req.user.id, name, description, status, startDate, endDate });
    res.status(201).json(project);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const { name, description, status, startDate, endDate } = req.body;
    await project.update({ name, description, status, startDate, endDate });
    res.json(project);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    await project.destroy();
    res.status(204).end();
  } catch (err) { next(err); }
};
