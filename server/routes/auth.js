const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { register, login } = require('../validators/auth');
const auth = require('../middleware/auth');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests' } });

router.post('/register', limiter, validate(register), authController.register);
router.post('/login', limiter, validate(login), authController.login);
router.post('/logout', auth, authController.logout);

module.exports = router;
