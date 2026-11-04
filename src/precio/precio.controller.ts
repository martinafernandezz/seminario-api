import { Request, Response } from 'express';
import { PrecioService } from './precio.service.js';

export class PrecioController {
  private service: PrecioService;

  constructor(service: PrecioService) {
    this.service = service;
  }

  async obtenerTodos(req: Request, res: Response) {
    try {
      console.log('🟢 GET /api/precios - Obteniendo todos los precios');
      const precios = await this.service.obtenerTodos();
      res.status(200).json(precios);
    } catch (error: any) {
      console.error('🔴 Error en GET /api/precios:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  }

  async crear(req: Request, res: Response) {
    try {
      console.log('🟢 POST /api/precios - Creando precio:', req.body);
      const precio = await this.service.crear(req.body);
      res.status(201).json(precio);
    } catch (error: any) {
      console.error('🔴 Error en POST /api/precios:', error);
      res.status(500).json({ 
        message: 'Error al crear precio',
        error: error.message 
      });
    }
  }

  async obtenerPorCancha(req: Request, res: Response) {
    try {
      const id_cancha = parseInt(req.params.id_cancha);
      const precios = await this.service.obtenerPorCancha(id_cancha);
      res.status(200).json(precios);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async obtenerPrecioActual(req: Request, res: Response) {
    try {
      const id_cancha = parseInt(req.params.id_cancha);
      const precio = await this.service.obtenerPrecioActual(id_cancha);
      res.status(200).json(precio);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async actualizar(req: Request, res: Response) {
    try {
      console.log('🟢 PUT /api/precios/:id - Actualizando precio:', req.params.id_precio, req.body);
      const id_precio = parseInt(req.params.id_precio);
      const precioActualizado = await this.service.actualizar(id_precio, req.body);
      res.status(200).json(precioActualizado);
    } catch (error: any) {
      console.error('🔴 Error en PUT /api/precios/:id:', error);
      res.status(500).json({ 
        message: 'Error al actualizar precio',
        error: error.message 
      });
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
      const id_precio = parseInt(req.params.id_precio);
      await this.service.eliminar(id_precio);
      res.status(200).json({ message: 'Precio eliminado correctamente' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const id_precio = parseInt(req.params.id_precio);
      const precio = await this.service.obtenerPorId(id_precio);
      if (!precio) {
        return res.status(404).json({ message: 'Precio no encontrado' });
      }
      res.status(200).json(precio);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}