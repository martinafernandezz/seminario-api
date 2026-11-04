import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsuarioRepository } from '../usuario/usuario.repository.js';

const router = Router();

const repository = new UsuarioRepository();
const service = new AuthService(repository);
const controller = new AuthController(service);

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refreshToken);

export default router;
