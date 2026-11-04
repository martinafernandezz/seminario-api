import { Router } from 'express';
import { CanchaController } from './cancha.controller.js';
import { CanchaService } from './cancha.service.js';
import { CanchaRepository } from './cancha.repository.js';

const router = Router();

const repository = new CanchaRepository();
const service = new CanchaService(repository);
const controller = new CanchaController(service);


router.post('/', controller.crear);
router.get('/', controller.obtenerTodas);
router.get('/:id', controller.obtenerPorId);
router.get('/disponibilidad', controller.obtenerDisponibilidad);
router.get('/tipo/:id_tipo', (req, res) => controller.obtenerPorTipo(req, res));
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export default router;
