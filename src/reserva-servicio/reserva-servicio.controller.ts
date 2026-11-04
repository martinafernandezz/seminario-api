import { Request, Response } from 'express';
import { ReservaServicioService } from './reserva-servicio.js';

export class ReservaServicioController {
  private service: ReservaServicioService;

  constructor() {
    this.service = new ReservaServicioService();
  }

  agregar = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.agregarServicioAReserva(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id_reserva, id_servicio } = req.params;
      const result = await this.service.eliminarServicioDeReserva(
        Number(id_reserva),
        Number(id_servicio)
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  };

  listarPorReserva = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id_reserva } = req.params;
      const servicios = await this.service.obtenerServiciosDeReserva(Number(id_reserva));
      res.json({ success: true, data: servicios });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  };
}
