import { Router } from 'express';
import { UsuarioController } from './usuario.controller.js';
import { UsuarioService } from './usuario.service.js';
import { UsuarioRepository } from './usuario.repository.js';
import { authenticateToken, requireAdmin, requireOwnerOrAdmin } from '../auth/auth.middleware.js';

const router = Router();

const repository = new UsuarioRepository();
const service = new UsuarioService(repository);
const controller = new UsuarioController(service);

router.get('/', authenticateToken, requireAdmin, controller.obtenerTodos.bind(controller));
router.get('/:id', authenticateToken, requireOwnerOrAdmin, controller.obtenerPorId.bind(controller));
router.post('/', authenticateToken, requireAdmin, controller.crear.bind(controller));
router.patch('/:id', authenticateToken, requireOwnerOrAdmin, controller.actualizar.bind(controller));
router.delete('/:id', authenticateToken, requireAdmin, controller.eliminar.bind(controller));

export default router;