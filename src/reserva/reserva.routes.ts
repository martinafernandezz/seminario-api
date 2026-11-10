import { Router } from 'express';
import { ReservaController } from '../reserva/reserva.cotroller.js';
import { authenticateToken, requireAdmin } from '../auth/auth.middleware.js';

const router = Router();
const controller = new ReservaController();

router.post('/', (req, res) => controller.crearReserva(req, res));
router.get('/', (req, res) => controller.obtenerTodas(req, res));

// reseñas, antes de '/:id'
router.get('/resenas', authenticateToken, requireAdmin, (req, res) => controller.obtenerResenas(req, res));
router.put('/:id/resena', authenticateToken, (req, res) => controller.registrarResena(req, res));
router.delete('/:id/resena', authenticateToken, requireAdmin, (req, res) => controller.eliminarResena(req, res));
router.get('/:id_reserva/servicios', (req, res) => controller.obtenerServicios(req, res));
router.get('/:id', (req, res) => controller.obtenerPorId(req, res));
router.put('/:id', (req, res) => controller.actualizarReserva(req, res));
router.delete('/:id', (req, res) => controller.eliminarReserva(req, res));


router.post('/:id/servicios', (req, res) => controller.agregarServicios(req, res));
router.delete('/:id/servicios/:id_servicio', (req, res) => controller.eliminarServicio(req, res));


router.post('/calcular-precio', (req, res) => controller.calcularPrecio(req, res));

export default router;

