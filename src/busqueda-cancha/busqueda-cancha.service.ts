import { DisponibilidadService } from '../disponibilidad/disponibilidad.service.js';
import { CanchaRepository } from '../cancha/cancha.repository.js';
import { CanchaConDisponibilidad } from './busqueda-cancha.entity.js';
import { AppDataSource } from '../database/data-source.js';
import { TipoCancha } from '../tipo_cancha/tipo-cancha.entity.js';
import { Localidad } from '../localidad/localidad.entity.js';

export class BusquedaCanchaService {
  private disponibilidadService: DisponibilidadService;
  private tipoCanchaRepository = AppDataSource.getRepository(TipoCancha);
  private localidadRepository = AppDataSource.getRepository(Localidad);

  constructor(private canchaRepository: CanchaRepository) {
    this.disponibilidadService = new DisponibilidadService(canchaRepository);
  }

  async buscarCanchasPorNombre(
    deporte: string,
    localidad: string,
    fecha?: string
  ): Promise<CanchaConDisponibilidad[]> {
    console.log('🔍 Búsqueda por nombre:', { deporte, localidad, fecha });

    const [tipo, localidadEncontrada] = await Promise.all([
      this.tipoCanchaRepository.findOne({ where: { deporte } }),
      this.localidadRepository.findOne({ where: { nombre: localidad } }),
    ]);

    if (!tipo || !localidadEncontrada) {
      console.log('❌ No se encontraron IDs');
      return [];
    }

    return await this.buscarCanchasDisponibles(
      fecha || new Date().toISOString().split('T')[0],
      tipo.id_tipo,
      localidadEncontrada.id
    );
  }

  async buscarCanchasDisponibles(
    fecha: string,
    id_tipo?: number,
    id_localidad?: number
  ): Promise<CanchaConDisponibilidad[]> {
    const where: {
      estado: 'disponible';
      id_tipo?: number;
      id_localidad?: number;
    } = {
      estado: 'disponible',
    };

    if (id_tipo) {
      where.id_tipo = id_tipo;
    }

    if (id_localidad) {
      where.id_localidad = id_localidad;
    }

    const canchas = await this.canchaRepository.findAll();
    const canchasFiltradas = canchas.filter((cancha) => {
      if (cancha.estado !== 'disponible') {
        return false;
      }

      if (where.id_tipo !== undefined && cancha.id_tipo !== where.id_tipo) {
        return false;
      }

      if (where.id_localidad !== undefined && cancha.id_localidad !== where.id_localidad) {
        return false;
      }

      return true;
    });

    console.log('📊 Canchas encontradas:', canchasFiltradas.length);

    if (canchasFiltradas.length === 0) return [];

    // Para cada cancha, obtener horarios disponibles
    const canchasConDisponibilidad: CanchaConDisponibilidad[] = [];

    for (const cancha of canchasFiltradas) {
      try {
        const horarios = await this.disponibilidadService.obtenerHorariosDisponibles({
          id_cancha: cancha.id_cancha,
          fecha
        });

        console.log(`⏰ Cancha ${cancha.nombre}: ${horarios.length} horarios`);

        canchasConDisponibilidad.push({
          id_cancha: cancha.id_cancha,
          nombre: cancha.nombre,
          estado: cancha.estado,
          id_tipo: cancha.id_tipo,
          id_localidad: cancha.id_localidad,
          precio_hora: Number(cancha.precio_hora) || 0,
          hora_apertura: cancha.hora_apertura,
          hora_cierre: cancha.hora_cierre,
          tipo_nombre: cancha.tipo_cancha?.deporte,
          localidad_nombre: cancha.localidad?.nombre,
          horarios_disponibles: horarios
        });
      } catch (error) {
        console.error(`❌ Error cancha ${cancha.id_cancha}:`, error);
      }
    }

    console.log('✅ Total canchas con horarios:', canchasConDisponibilidad.length);
    return canchasConDisponibilidad;
  }
}