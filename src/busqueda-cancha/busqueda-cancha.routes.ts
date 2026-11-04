import { Router } from 'express';
import { buscarCanchas, buscarCanchasPorNombres } from './busqueda-cancha.controller.js';

const router = Router();

// GET con query params
router.get('/', buscarCanchas);

// POST con body
router.post('/', buscarCanchasPorNombres);

export default router;
