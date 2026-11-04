import { Router } from 'express';
import { obtenerDisponibilidad, obtenerDisponibilidadQuery } from './disponibilidad.controller.js';

const router = Router();

// GET /api/disponibilidad/1/2025-11-15
router.get('/:id_cancha/:fecha', obtenerDisponibilidad);

// GET /api/disponibilidad?id_cancha=1&fecha=2025-11-15
router.get('/', obtenerDisponibilidadQuery);

export default router;