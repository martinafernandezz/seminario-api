import { Router } from 'express';
import { ReservaServicioController } from './reserva-servicio.controller.js';

const router = Router();
const controller = new ReservaServicioController();

router.post('/', (req, res) => controller.agregar(req, res));
router.delete('/:id_reserva/:id_servicio', (req, res) => controller.eliminar(req, res));
router.get('/:id_reserva', (req, res) => controller.listarPorReserva(req, res));

export default router;
