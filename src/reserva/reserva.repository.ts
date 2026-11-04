import { AppDataSource } from '../database/data-source.js';
import { Reserva, ReservaCreate, ReservaUpdate } from './reserva.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { In } from 'typeorm';

export class ReservaRepository {
  private repository = AppDataSource.getRepository(Reserva);
  private servicioRepository = AppDataSource.getRepository(Servicio);

  async findAll(): Promise<Reserva[]> {
    return this.repository.find({ relations: ['servicios'] });
  }

  async findByIdReserva(id_reserva: number): Promise<Reserva | null> {
    return this.repository.findOne({ where: { id_reserva }, relations: ['servicios'] });
  }

  async findByUsuario(id_usuario: number): Promise<Reserva[]> {
    return this.repository.find({ where: { id_usuario }, relations: ['servicios'] });
  }

  async findByCancha(id_cancha: number): Promise<Reserva[]> {
    return this.repository.find({ where: { id_cancha }, relations: ['servicios'] });
  }

  async findByFecha(fecha: string): Promise<Reserva[]> {
    return this.repository.find({ where: { fecha }, relations: ['servicios'] });
  }

  async findByRangoFecha(fecha_inicio: string, fecha_fin: string): Promise<Reserva[]> {
    return this.repository
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.servicios', 'servicios')
      .where('reserva.fecha BETWEEN :fecha_inicio AND :fecha_fin', { fecha_inicio, fecha_fin })
      .getMany();
  }

  async create(data: ReservaCreate): Promise<Reserva> {
    const servicios = data.id_servicios
      ? await this.servicioRepository.find({ where: { id_servicio: In(data.id_servicios) } })
      : [];

    const reserva = this.repository.create({
      ...data,
      servicios
    });
    return this.repository.save(reserva);
  }

  async actualizar(reserva: Reserva): Promise<Reserva> {
    return this.repository.save(reserva);
  }

  async update(id_reserva: number, data: ReservaUpdate): Promise<Reserva | null> {
    const { id_servicios, ...updateData } = data;
    
    await this.repository.update({ id_reserva }, updateData);
    
    const reserva = await this.repository.findOne({ where: { id_reserva }, relations: ['servicios'] });
    if (!reserva) return null;

    if (id_servicios && id_servicios.length > 0) {
      const servicios = await this.servicioRepository.find({
        where: { id_servicio: In(id_servicios) }
      });
      reserva.servicios = servicios;
      return this.repository.save(reserva);
    }

    return reserva;
  }

  async delete(id_reserva: number): Promise<void> {
    await this.repository.delete(id_reserva);
  }

  async addServicios(id_reserva: number, id_servicios: number[]): Promise<void> {
    const reserva = await this.findByIdReserva(id_reserva);
    if (!reserva) throw new Error('Reserva no encontrada');

    const servicios = await this.servicioRepository.find({
      where: { id_servicio: In(id_servicios) }
    });
    
    const existentes = new Set(reserva.servicios?.map(s => s.id_servicio) || []);
    const nuevoServicios = servicios.filter(s => !existentes.has(s.id_servicio));
    
    reserva.servicios = [...(reserva.servicios || []), ...nuevoServicios];
    await this.repository.save(reserva);
  }

  async removeServicio(id_reserva: number, id_servicio: number): Promise<void> {
    const reserva = await this.findByIdReserva(id_reserva);
    if (!reserva) throw new Error('Reserva no encontrada');

    reserva.servicios = reserva.servicios?.filter(s => s.id_servicio !== id_servicio) || [];
    await this.repository.save(reserva);
  }

  async findServiciosByReserva(id_reserva: number): Promise<Servicio[]> {
    const reserva = await this.findByIdReserva(id_reserva);
    return reserva?.servicios || [];
  }

  async findAllWithServicios(): Promise<Reserva[]> {
    return this.repository.find({ relations: ['servicios'] });
  }

  async findByIdWithServicios(id_reserva: number): Promise<Reserva | null> {
    return this.repository.findOne({ where: { id_reserva }, relations: ['servicios'] });
  }
}