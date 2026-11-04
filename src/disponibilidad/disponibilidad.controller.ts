import { Request, Response } from 'express';
import { DisponibilidadService } from './disponibilidad.service.js';
import { CanchaRepository } from '../cancha/cancha.repository.js';

const canchaRepository = new CanchaRepository();
const service = new DisponibilidadService(canchaRepository);

export async function obtenerDisponibilidad(req: Request, res: Response) {
  try {
    const { id_cancha, fecha } = req.params;
    
    if (!fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Formato de fecha inválido. Use YYYY-MM-DD' 
      });
    }

    const franjas = await service.obtenerHorariosDisponibles({
      id_cancha: Number(id_cancha),
      fecha
    });

    res.json({ success: true, data: franjas });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function obtenerDisponibilidadQuery(req: Request, res: Response) {
  try {
    const { id_cancha, fecha } = req.query;
    
    if (!id_cancha || !fecha) {
      return res.status(400).json({ 
        success: false, 
        message: 'id_cancha y fecha son requeridos' 
      });
    }
    
    if (!String(fecha).match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Formato de fecha inválido. Use YYYY-MM-DD' 
      });
    }

    const franjas = await service.obtenerHorariosDisponibles({
      id_cancha: Number(id_cancha),
      fecha: String(fecha)
    });

    // Horarios disponibles para el frontend
    const horariosDisponibles = franjas
      .filter(franja => franja.disponible)
      .map(franja => franja.hora_inicio);

    res.json({ 
      success: true, 
      horariosDisponibles: horariosDisponibles,
      data: franjas 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
