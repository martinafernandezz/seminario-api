import { Request, Response } from 'express';
import { ServicioService } from './servicio.service.js';

export class ServicioController {
  private service: ServicioService;

  constructor() {
    this.service = new ServicioService();
  }

  obtenerTodos = async (req: Request, res: Response) => {
    try {
      const servicios = await this.service.obtenerTodos();
      res.json({ success: true, data: servicios });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  };

  obtenerPorId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const servicio = await this.service.obtenerPorId(id);
      res.json({ success: true, data: servicio });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  };

  crear = async (req: Request, res: Response) => {
    try {
      const id = await this.service.crearServicio(req.body);
      res.status(201).json({ success: true, message: 'Servicio creado', id });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  };

  actualizar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.actualizarServicio(id, req.body);
      res.json({ success: true, message: 'Servicio actualizado' });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  };

  eliminar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.eliminarServicio(id);
      res.json({ success: true, message: 'Servicio eliminado' });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  };

  
  asignarAReserva = async (req: Request, res: Response) => {
    try {
      const id_reserva = Number(req.params.id_reserva);
      const { id_servicios } = req.body; // array de ids de servicios
      await this.service.asignarServiciosAReserva(id_reserva, id_servicios);
      res.json({ success: true, message: 'Servicios asignados a la reserva' });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  };

  obtenerPorReserva = async (req: Request, res: Response) => {
    try {
      const id_reserva = Number(req.params.id_reserva);
      const servicios = await this.service.obtenerServiciosDeReserva(id_reserva);
      res.json({ success: true, data: servicios });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  };
}
