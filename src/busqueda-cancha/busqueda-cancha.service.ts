import { LessThanOrEqual } from 'typeorm';
import { DisponibilidadService } from '../disponibilidad/disponibilidad.service.js';
import { CanchaRepository } from '../cancha/cancha.repository.js';
import { CanchaConDisponibilidad } from './busqueda-cancha.entity.js';
import { AppDataSource } from '../database/data-source.js';
import { TipoCancha } from '../tipo_cancha/tipo-cancha.entity.js';
import { Precio } from '../precio/precio.entity.js';

export class BusquedaCanchaService {
  private disponibilidadService: DisponibilidadService;
  private tipoCanchaRepository = AppDataSource.getRepository(TipoCancha);
  private precioRepository = AppDataSource.getRepository(Precio);

  constructor(private canchaRepository: CanchaRepository) {
    this.disponibilidadService = new DisponibilidadService(canchaRepository);
  }

  async buscarCanchasPorNombre(
    deporte: string,
    fecha?: string
  ): Promise<CanchaConDisponibilidad[]> {
    console.log('🔍 Búsqueda por deporte:', { deporte, fecha });

    // varios tipos comparten deporte
    const tipos = await this.tipoCanchaRepository.find({ where: { deporte } });
    if (tipos.length === 0) {
      console.log('❌ No se encontró el deporte');
      return [];
    }

    const fechaBusqueda = fecha || new Date().toISOString().split('T')[0];
    const resultados = await Promise.all(
      tipos.map((tipo) => this.buscarCanchasDisponibles(fechaBusqueda, tipo.id_tipo))
    );
    return resultados.flat();
  }

  async buscarCanchasDisponibles(
    fecha: string,
    id_tipo?: number
  ): Promise<CanchaConDisponibilidad[]> {
    const canchas = await this.canchaRepository.findAll();
    const canchasFiltradas = canchas.filter((cancha) => {
      if (cancha.estado !== 'disponible') {
        return false;
      }

      if (id_tipo !== undefined && cancha.id_tipo !== id_tipo) {
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

        // precio vigente a esa fecha
        const precio = await this.precioRepository.findOne({
          where: { id_cancha: cancha.id_cancha, fecha_vigencia: LessThanOrEqual(fecha) },
          order: { fecha_vigencia: 'DESC' },
        });

        console.log(`⏰ Cancha ${cancha.nombre}: ${horarios.length} horarios`);

        canchasConDisponibilidad.push({
          id_cancha: cancha.id_cancha,
          nombre: cancha.nombre,
          estado: cancha.estado,
          id_tipo: cancha.id_tipo,
          precio_hora: precio ? Number(precio.precio_por_hora) : 0,
          tipo_nombre: cancha.tipo_cancha?.deporte,
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
