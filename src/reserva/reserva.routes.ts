import { Router } from 'express';
import { ReservaController } from '../reserva/reserva.cotroller.js';

const router = Router();
const controller = new ReservaController();

router.post('/', (req, res) => controller.crearReserva(req, res));
router.get('/', (req, res) => controller.obtenerTodas(req, res));
router.get('/:id_reserva/servicios', (req, res) => controller.obtenerServicios(req, res));
router.get('/:id', (req, res) => controller.obtenerPorId(req, res));
router.put('/:id', (req, res) => controller.actualizarReserva(req, res));
router.delete('/:id', (req, res) => controller.eliminarReserva(req, res));


router.post('/:id/servicios', (req, res) => controller.agregarServicios(req, res));
router.delete('/:id/servicios/:id_servicio', (req, res) => controller.eliminarServicio(req, res));


router.post('/calcular-precio', (req, res) => controller.calcularPrecio(req, res));

export default router;

