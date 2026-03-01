import express from 'express';
import protectedRoute from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../lib/utils.js';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));

router.put('/update-profile', asyncHandler(protectedRoute), asyncHandler(updateProfile));

export default router;