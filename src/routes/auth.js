import { Router } from 'express';
import { 
  login, register, logout, profile, updateProfile, debugAuth, checkAuthStatus } from '../controllers/AuthController.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);
router.put('/profile', authRequired, updateProfile);
router.get('/debug', authRequired, debugAuth);
router.get('/check-status', checkAuthStatus); // Sin autenticación requerida

export default router;