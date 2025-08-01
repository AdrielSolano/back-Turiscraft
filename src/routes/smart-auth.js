import { Router } from 'express';
import { smartRegister, smartLogin, smartProfile, updateSmartProfile, listUsers, debugSmartAuth } from '../controllers/SmartAuthController.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Smart auth routes
router.post('/register', smartRegister);
router.post('/login', smartLogin);
router.get('/profile', authRequired, smartProfile);
router.put('/profile', authRequired, updateSmartProfile);
router.get('/users', listUsers); // Endpoint temporal para debugging
router.get('/debug', authRequired, debugSmartAuth);

export default router; 