import { Request, Response } from 'express';
import { PagoService } from './pago.service.js';

export class PagoController {
  constructor(private service: PagoService) {}

  crearPago = async (req: Request, res: Response): Promise<void> => {
    try {
      const pago = await this.service.crearPago(req.body);
      res.status(201).json({
        success: true,
        data: pago,
        message: 'Pago creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear pago'
      });
    }
  };

  obtenerPago = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const pago = await this.service.obtenerPago(id);
      res.status(200).json({
        success: true,
        data: pago
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Pago no encontrado'
      });
    }
  };

  obtenerPagoPorReserva = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_reserva = parseInt(req.params.id_reserva);
      const pago = await this.service.obtenerPagoPorReserva(id_reserva);
      res.status(200).json({
        success: true,
        data: pago
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Pago no encontrado'
      });
    }
  };

  procesarPago = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { transaccion_id } = req.body;
      
      const pago = await this.service.procesarPago(id, transaccion_id);
      res.status(200).json({
        success: true,
        data: pago,
        message: 'Pago procesado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al procesar pago'
      });
    }
  };

  simularPago = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      // Iniciar simulación asíncrona
      this.service.simularProcesoPago(id)
        .then(pago => {
          console.log(`✅ Pago ${id} procesado: ${pago.estado}`);
        })
        .catch(error => {
          console.error(`❌ Error en pago ${id}:`, error);
        });

      // Responder inmediatamente
      res.status(202).json({
        success: true,
        message: 'Proceso de pago iniciado. El estado se actualizará en breve.',
        data: { id_pago: id, estado: 'procesando' }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al iniciar pago'
      });
    }
  };
}