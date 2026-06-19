const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { register, login } = require('../validators/auth');
const auth = require('../middleware/auth');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests' } });

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName: { type: string, example: John Doe }
 *               email: { type: string, example: john@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       201: { description: User created }
 *       400: { description: Validation error }
 *       409: { description: Email already registered }
 */
router.post('/register', limiter, validate(register), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: john@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200: { description: Returns token and user }
 *       401: { description: Invalid credentials }
 */
router.post('/login', limiter, validate(login), authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logged out }
 */
router.post('/logout', auth, authController.logout);

module.exports = router;
