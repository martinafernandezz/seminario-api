import { Router } from 'express';
import { PrecioController } from './precio.controller.js';
import { PrecioService } from './precio.service.js';
import { PrecioRepository } from './precio.repository.js';

const router = Router();

const repository = new PrecioRepository();
const service = new PrecioService(repository);
const controller = new PrecioController(service);

// ✅ RUTA CRÍTICA QUE FALTA - Obtener TODOS los precios
router.get('/', (req, res) => controller.obtenerTodos(req, res));

// Tus rutas existentes
router.get('/cancha/:id_cancha', (req, res) => controller.obtenerPorCancha(req, res));
router.get('/actual/:id_cancha', (req, res) => controller.obtenerPrecioActual(req, res));
router.post('/', (req, res) => controller.crear(req, res));
router.put('/:id_precio', (req, res) => controller.actualizar(req, res));
router.delete('/:id_precio', (req, res) => controller.eliminar(req, res));

export default router;