import { Request, Response } from 'express';
import { ReservaService } from './reserva.service.js';

export class ReservaController {
  private service: ReservaService;

  constructor() {
    this.service = new ReservaService();
  }

  async crearReserva(req: Request, res: Response) {
    try {
      const reserva = await this.service.crearReserva(req.body);
      res.status(201).json({ success: true, data: reserva });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async obtenerTodas(req: Request, res: Response) {
    const reservas = await this.service.obtenerTodasConServicios();
    res.json({ success: true, data: reservas });
  }

  async obtenerPorId(req: Request, res: Response) {
    const id_reserva = Number(req.params.id);
    const reserva = await this.service.obtenerPorIdConServicios(id_reserva);
    if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    res.json({ success: true, data: reserva });
  }

  async agregarServicios(req: Request, res: Response) {
    const id_reserva = Number(req.params.id);
    const { id_servicios } = req.body;
    await this.service.agregarServicios(id_reserva, id_servicios);
    res.json({ success: true, message: 'Servicios agregados correctamente' });
  }

  async eliminarServicio(req: Request, res: Response) {
    const id_reserva = Number(req.params.id);
    const id_servicio = Number(req.params.id_servicio);
    await this.service.eliminarServicio(id_reserva, id_servicio);
    res.json({ success: true, message: 'Servicio eliminado correctamente' });
  }

  async actualizarReserva(req: Request, res: Response) {
    try {
      const reserva = req.body;
      const updated = await this.service.actualizarReserva(reserva);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async eliminarReserva(req: Request, res: Response) {
    try {
      const id_reserva = Number(req.params.id);
      await this.service.eliminarReserva(id_reserva);
      res.json({ success: true, message: 'Reserva eliminada correctamente' });
    } catch (error: any) {
      console.error('Error eliminando reserva:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar la reserva' });
    }
  }
  
  async obtenerServicios(req: Request, res: Response) {
    try {
      const id_reserva = Number(req.params.id_reserva);
      const servicios = await this.service.obtenerServicios(id_reserva);
      res.json({ success: true, data: servicios });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  
  async calcularPrecio(req: Request, res: Response) {
    try {
      const { id_cancha, fecha, hora_inicio, hora_fin, id_servicios } = req.body;
      const precio = await this.service.calcularPrecioEnTiempoReal({
        id_cancha,
        fecha,
        hora_inicio,
        hora_fin,
        id_servicios: id_servicios || []
      });
      res.json({ success: true, data: precio });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}