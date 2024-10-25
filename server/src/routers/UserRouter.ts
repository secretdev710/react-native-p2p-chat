// UserRouter.ts
import express from 'express';
const router = express.Router();

const { Register, Login } = require('../controllers/UserController');

router.post('/register', Register);
router.post('/login', Login);

export default router;
