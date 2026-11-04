import { Router } from 'express';
import { ServicioController } from './servicio.controller.js';

const router = Router();
const controller = new ServicioController();

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);


router.post('/reserva/:id_reserva', controller.asignarAReserva);
router.get('/reserva/:id_reserva', controller.obtenerPorReserva);

export default router;
