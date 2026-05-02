import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// GET /api/users (solo admin)
router.get('/', authenticate, authorize(['admin']), UserController.getAll);

// GET /api/users/me (cualquier usuario autenticado)
router.get('/me', authenticate, authorize([]), UserController.getMe);

// PUT /api/users/:id (usuario autenticado edita su perfil)
router.put('/:id', authenticate, authorize([]), UserController.update);

export default router;