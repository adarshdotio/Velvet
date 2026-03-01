import express from 'express';
import { asyncHandler } from '../lib/utils.js';
import protectedRoute from '../middlewares/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', asyncHandler(protectedRoute), asyncHandler(getUsersForSidebar));

router.get('/:id', asyncHandler(protectedRoute), asyncHandler(getMessages));

router.get('/send/:id', asyncHandler(protectedRoute), asyncHandler(sendMessage));

export default router;