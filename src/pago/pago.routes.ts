import { Router } from 'express';
import { PagoController } from './pago.controller.js';
import { PagoService } from './pago.service.js';
import { PagoRepository } from './pago.repository.js';

const router = Router();

const repository = new PagoRepository();
const service = new PagoService(repository);
const controller = new PagoController(service);



//  Crear un nuevo pago
router.post('/', controller.crearPago);

//  Obtener pago por ID
router.get('/:id', controller.obtenerPago);

//  Obtener pago por reserva
router.get('/reserva/:id_reserva', controller.obtenerPagoPorReserva);

//Procesar pago (confirmar)
router.put('/:id/procesar', controller.procesarPago);

//Simular proceso de pago
router.post('/:id/simular', controller.simularPago);

// READ - Obtener todos los pagos (si necesitas)
router.get('/', async (req, res) => {
  // Este endpoint lo puedes implementar después si lo necesitas
  res.status(200).json({ 
    success: true, 
    message: 'Endpoint para obtener todos los pagos' 
  });
});

// Actualizar estado de pago
router.put('/:id', async (req, res) => {
  // Este endpoint lo puedes implementar después si lo necesitas
  res.status(200).json({ 
    success: true, 
    message: 'Endpoint para actualizar pago' 
  });
});


export default router;