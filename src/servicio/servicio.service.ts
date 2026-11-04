import { ServicioRepository } from './servicio.repository.js';
import { ServicioCreate, ServicioUpdate } from './servicio.entity.js';
import { AppDataSource } from '../database/data-source.js';
import { Reserva } from '../reserva/reserva.entity.js';

export class ServicioService {
  private repository: ServicioRepository;
  private reservaRepository = AppDataSource.getRepository(Reserva);

  constructor() {
    this.repository = new ServicioRepository();
  }

  async obtenerTodos() {
    return this.repository.findAll();
  }

  async obtenerPorId(id_servicio: number) {
    const servicio = await this.repository.findById(id_servicio);
    if (!servicio) throw new Error('Servicio no encontrado');
    return servicio;
  }

  async crearServicio(data: ServicioCreate) {
    return this.repository.create(data);
  }

  async actualizarServicio(id_servicio: number, data: ServicioUpdate) {
    const servicioAnterior = await this.repository.findById(id_servicio);
    if (!servicioAnterior) {
      throw new Error('Servicio no encontrado');
    }

    const oldPrice = Number(servicioAnterior.precio_servicio) || 0;

    if (data.precio_servicio !== undefined) {
      await this.repository.update(id_servicio, data);

      const diferencia = Number(data.precio_servicio) - oldPrice;
      if (diferencia !== 0) {
        const reservas = await this.reservaRepository
          .createQueryBuilder('reserva')
          .leftJoinAndSelect('reserva.servicios', 'servicio')
          .where('servicio.id_servicio = :id_servicio', { id_servicio })
          .getMany();

        for (const reserva of reservas) {
          reserva.precio_total = Number(reserva.precio_total) + diferencia;
        }

        if (reservas.length > 0) {
          await this.reservaRepository.save(reservas);
        }
      }
    } else {
      await this.repository.update(id_servicio, data);
    }

    return { success: true, message: 'Servicio actualizado correctamente' };
  }

  async eliminarServicio(id_servicio: number) {
    const servicio = await this.repository.findById(id_servicio);
    if (!servicio) {
      throw new Error('Servicio no encontrado');
    }

    const precio = Number(servicio.precio_servicio) || 0;
    const reservas = await this.reservaRepository.find({ relations: ['servicios'] });

    for (const reserva of reservas) {
      const tieneServicio = (reserva.servicios || []).some((s) => s.id_servicio === id_servicio);
      if (!tieneServicio) {
        continue;
      }

      reserva.precio_total = Math.max(0, Number(reserva.precio_total) - precio);
      reserva.servicios = (reserva.servicios || []).filter((s) => s.id_servicio !== id_servicio);
    }

    if (reservas.length > 0) {
      await this.reservaRepository.save(reservas);
    }

    return this.repository.delete(id_servicio);
  }

  async asignarServiciosAReserva(id_reserva: number, id_servicios: number[]) {
    // Este método ha sido migrado a ReservaRepository.addServicios()
    // La relación ManyToMany se maneja directamente en la entidad Reserva
    throw new Error('Use ReservaRepository.addServicios() instead');
  }

  async obtenerServiciosDeReserva(id_reserva: number) {
    return this.repository.obtenerPorReserva(id_reserva);
  }
}