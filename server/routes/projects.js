const router = require('express').Router();
const ctrl = require('../controllers/projectController');
const validate = require('../middleware/validate');
const { create, update } = require('../validators/project');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', validate(create), ctrl.create);
router.put('/:id', validate(update), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
