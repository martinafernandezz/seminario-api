import { Request, Response } from 'express';
import { CanchaService } from './cancha.service.js';
import { AppDataSource } from '../database/data-source.js';
import { Cancha, HORA_APERTURA, HORA_CIERRE } from './cancha.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';
import { In } from 'typeorm';

export class CanchaController {
  constructor(private service: CanchaService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const cancha = await this.service.crearCancha(req.body);
      res.status(201).json({
        success: true,
        data: cancha,
        message: 'Cancha creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear cancha'
      });
    }
  };

  obtenerTodas = async (req: Request, res: Response): Promise<void> => {
    try {
      const canchas = await this.service.obtenerTodas();
      res.status(200).json({
        success: true,
        data: canchas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener canchas'
      });
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const cancha = await this.service.obtenerPorId(id);
      res.status(200).json({
        success: true,
        data: cancha
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Cancha no encontrada'
      });
    }
  };

  obtenerPorTipo = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_tipo = parseInt(req.params.id_tipo);
      const canchas = await this.service.obtenerPorTipo(id_tipo);
      res.status(200).json({
        success: true,
        data: canchas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener canchas por tipo'
      });
    }
  };

  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const cancha = await this.service.actualizarCancha(id, req.body);
      res.status(200).json({
        success: true,
        data: cancha,
        message: 'Cancha actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar cancha'
      });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.service.eliminarCancha(id);
      res.status(200).json({
        success: true,
        message: 'Cancha eliminada exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Cancha no encontrada'
      });
    }
  };

 obtenerDisponibilidad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fecha, id_tipo } = req.query;
    
    console.log(`🔍 Buscando disponibilidad - Fecha: ${fecha}, Tipo: ${id_tipo}`);
    
    const canchaRepository = AppDataSource.getRepository(Cancha);
    const reservaRepository = AppDataSource.getRepository(Reserva);

    const where: {
      estado: 'disponible';
      id_tipo?: number;
    } = {
      estado: 'disponible',
    };

    if (id_tipo) {
      where.id_tipo = Number(id_tipo);
    }

    const canchas = await canchaRepository.find({
      where,
      relations: ['tipo_cancha'],
    });

    console.log(`🏟️ Canchas encontradas: ${canchas.length}`);

    const idCanchas = canchas.map((c) => c.id_cancha);
    const reservas = idCanchas.length
      ? await reservaRepository.find({
          where: {
            id_cancha: In(idCanchas),
            fecha: String(fecha),
          },
          select: ['id_cancha', 'hora_inicio', 'hora_fin'],
        })
      : [];
    
    // 2. Para cada cancha, calcular horarios disponibles
    const canchasConDisponibilidad = await Promise.all(
      canchas.map(async (cancha) => {
        const reservasCancha = reservas.filter((r) => r.id_cancha === cancha.id_cancha);

        console.log(` Cancha ${cancha.nombre}: ${reservasCancha.length} reservas encontradas`);
        
        // horarios libres dentro del horario de atención
        const horariosOcupados = reservasCancha.map((r) => ({
          inicio: r.hora_inicio,
          fin: r.hora_fin
        }));
        
        const horaApertura = HORA_APERTURA;
        const horaCierre = HORA_CIERRE;
        
        const horariosDisponibles = this.calcularHorariosDisponibles(
          horaApertura, 
          horaCierre, 
          horariosOcupados
        );
        
        return {
          ...cancha,
          tipo_nombre: cancha.tipo_cancha?.nombre,
          deporte: cancha.tipo_cancha?.deporte,
          horarios_disponibles: horariosDisponibles,
          horarios_ocupados: horariosOcupados,
          total_reservas: horariosOcupados.length
        };
      })
    );
    
    res.json({ 
      success: true, 
      data: canchasConDisponibilidad,
      message: `Disponibilidad obtenida para ${canchasConDisponibilidad.length} canchas`
    });
    
  } catch (error: any) {
    console.error('❌ Error en obtenerDisponibilidad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener disponibilidad: ' + error.message 
    });
  }
};


private calcularHorariosDisponibles(
  horaApertura: string, 
  horaCierre: string, 
  horariosOcupados: any[]
): string[] {
  const horariosDisponibles = [];
  
 
  const apertura = parseInt(horaApertura.split(':')[0]);
  const cierre = parseInt(horaCierre.split(':')[0]);
  
  console.log(`🕐 Calculando horarios de ${apertura}:00 a ${cierre}:00`);
  
  // Generar horarios cada hora desde apertura hasta cierre-1
  for (let hora = apertura; hora < cierre; hora++) {
    const horario = `${hora.toString().padStart(2, '0')}:00:00`;
    const horarioFin = `${(hora + 1).toString().padStart(2, '0')}:00:00`;
    
    // Verificar si el horario está ocupado
    const estaOcupado = horariosOcupados.some(ocupado => {
      // Si los horarios se superponen, está ocupado
      return !(horarioFin <= ocupado.inicio || horario >= ocupado.fin);
    });
    
    if (!estaOcupado) {
      horariosDisponibles.push(horario);
    }
  }
  
  console.log(`🕐 Horarios disponibles calculados: ${horariosDisponibles.length}`);
  return horariosDisponibles;
}
}