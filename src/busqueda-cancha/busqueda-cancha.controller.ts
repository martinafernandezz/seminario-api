import { Request, Response } from 'express';
import { BusquedaCanchaService } from './busqueda-cancha.service.js';
import { CanchaRepository } from '../cancha/cancha.repository.js';

const canchaRepository = new CanchaRepository();
const service = new BusquedaCanchaService(canchaRepository);

export async function buscarCanchas(req: Request, res: Response) {
  try {
    const { fecha, id_tipo, id_localidad } = req.query;

    // Validar fecha requerida
    if (!fecha) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      });
    }

    // Validar formato de fecha
    if (!String(fecha).match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido. Use YYYY-MM-DD'
      });
    }

    const canchas = await service.buscarCanchasDisponibles(
      String(fecha),
      id_tipo ? Number(id_tipo) : undefined,
      id_localidad ? Number(id_localidad) : undefined
    );

    res.json({
      success: true,
      data: {
        fecha: fecha,
        filtros: {
          id_tipo: id_tipo || null,
          id_localidad: id_localidad || null
        },
        total_canchas: canchas.length,
        canchas
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

// Nueva función para POST con nombres en lugar de IDs
export async function buscarCanchasPorNombres(req: Request, res: Response) {
  try {
    console.log('🔍 POST body:', req.body);
    
    const { deporte, localidad, fecha } = req.body;

    // Usar fecha actual si no se proporciona
    const fechaBusqueda = fecha || new Date().toISOString().split('T')[0];

    // Validar que se proporcionen deporte y localidad
    if (!deporte || !localidad) {
      return res.status(400).json({
        success: false,
        message: 'Deporte y localidad son requeridos'
      });
    }

    console.log(`🔍 Buscando: deporte=${deporte}, localidad=${localidad}, fecha=${fechaBusqueda}`);

    // Usar el nuevo método del servicio
    const canchas = await service.buscarCanchasPorNombre(
      deporte,
      localidad,
      fechaBusqueda
    );

    res.json({
      success: true,
      data: {
        fecha: fechaBusqueda,
        filtros: {
          deporte,
          localidad
        },
        total_canchas: canchas.length,
        canchas
      }
    });

  } catch (error: any) {
    console.error('❌ Error en buscarCanchasPorNombres:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}