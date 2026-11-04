import { Router } from 'express';
import { LocalidadController } from './localidad.controller.js';
import { LocalidadService } from './localidad.service.js';
import { LocalidadRepository } from './localidad.repository.js';

const router = Router();

const repository = new LocalidadRepository();
const service = new LocalidadService(repository);
const controller = new LocalidadController(service);

router.post('/', controller.crear.bind(controller));
router.get('/', controller.obtenerTodas.bind(controller));
router.get('/:id', controller.obtenerPorId.bind(controller));
router.put('/:id', controller.actualizar.bind(controller));
router.delete('/:id', controller.eliminar.bind(controller));

export default router;