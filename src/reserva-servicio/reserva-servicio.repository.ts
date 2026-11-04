import { AppDataSource } from '../database/data-source.js';
import { Reserva } from '../reserva/reserva.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { ReservaServicio, ReservaServicioCreate } from './reserva-servicio.entity.js';

export class ReservaServicioRepository {
  private reservaRepository = AppDataSource.getRepository(Reserva);
  private servicioRepository = AppDataSource.getRepository(Servicio);

  async agregar(data: ReservaServicioCreate): Promise<void> {
    const [reserva, servicio] = await Promise.all([
      this.reservaRepository.findOne({ where: { id_reserva: data.id_reserva }, relations: ['servicios'] }),
      this.servicioRepository.findOne({ where: { id_servicio: data.id_servicio } }),
    ]);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (!servicio) {
      throw new Error('Servicio no encontrado');
    }

    const yaExiste = reserva.servicios?.some((s) => s.id_servicio === data.id_servicio);
    if (yaExiste) {
      return;
    }

    reserva.servicios = [...(reserva.servicios || []), servicio];
    await this.reservaRepository.save(reserva);
  }

  async eliminar(id_reserva: number, id_servicio: number): Promise<void> {
    const reserva = await this.reservaRepository.findOne({
      where: { id_reserva },
      relations: ['servicios'],
    });

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    reserva.servicios = (reserva.servicios || []).filter((s) => s.id_servicio !== id_servicio);
    await this.reservaRepository.save(reserva);
  }

  async eliminarTodosPorReserva(id_reserva: number): Promise<void> {
    const reserva = await this.reservaRepository.findOne({
      where: { id_reserva },
      relations: ['servicios'],
    });

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    reserva.servicios = [];
    await this.reservaRepository.save(reserva);
  }

  async obtenerPorReserva(id_reserva: number): Promise<any[]> {
    const reserva = await this.reservaRepository.findOne({
      where: { id_reserva },
      relations: ['servicios'],
    });

    return (reserva?.servicios || []).map((s) => ({
      id_servicio: s.id_servicio,
      nombre: s.nombre,
      precio_servicio: s.precio_servicio,
    }));
  }
}
