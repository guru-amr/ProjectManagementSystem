const { fn, col, literal } = require('sequelize');
const { Project, Task } = require('../models');

exports.stats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalProjects = await Project.count({ where: { userId } });
    const projectsInProgress = await Project.count({ where: { userId, status: 'In Progress' } });

    const taskCounts = await Task.findAll({
      attributes: ['status', [fn('COUNT', col('Task.id')), 'count']],
      include: [{ model: Project, where: { userId }, attributes: [] }],
      group: ['status'],
      raw: true,
    });

    const countMap = Object.fromEntries(taskCounts.map(r => [r.status, parseInt(r.count)]));
    const totalTasks = Object.values(countMap).reduce((a, b) => a + b, 0);

    res.json({
      totalProjects,
      projectsInProgress,
      totalTasks,
      completedTasks: countMap['Completed'] || 0,
      pendingTasks: countMap['Pending'] || 0,
    });
  } catch (err) { next(err); }
};
