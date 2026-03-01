import express from 'express';
import { asyncHandler } from '../lib/utils.js';
import { signup, login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));

export default router;