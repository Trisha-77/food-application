import express from 'express';
import authMiddleware from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import { dashboard, listUsers } from '../controllers/adminController.js';

const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminAuth);
adminRouter.get('/dashboard', dashboard);
adminRouter.get('/users', listUsers);

export default adminRouter;
