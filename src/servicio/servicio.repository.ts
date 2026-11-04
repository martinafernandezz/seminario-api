import { AppDataSource } from '../database/data-source.js';
import { Servicio, ServicioCreate, ServicioUpdate } from './servicio.entity.js';

export class ServicioRepository {
  private repository = AppDataSource.getRepository(Servicio);

  async findAll(): Promise<Servicio[]> {
    return this.repository.find();
  }

  async findById(id_servicio: number): Promise<Servicio | null> {
    return this.repository.findOne({ where: { id_servicio } });
  }

  async create(data: ServicioCreate): Promise<Servicio> {
    const servicio = this.repository.create(data);
    return this.repository.save(servicio);
  }

  async update(id_servicio: number, data: ServicioUpdate): Promise<Servicio | null> {
    await this.repository.update({ id_servicio }, data);
    return this.repository.findOne({ where: { id_servicio } });
  }

  async delete(id_servicio: number): Promise<void> {
    await this.repository.delete({ id_servicio });
  }

  async findByName(nombre: string): Promise<Servicio | null> {
    return this.repository.findOne({ where: { nombre } });
  }

  async obtenerPorReserva(id_reserva: number): Promise<Servicio[]> {
    const servicios = await this.repository
      .createQueryBuilder('servicio')
      .innerJoinAndSelect(
        'servicio.reservas',
        'reserva',
        'reserva.id_reserva = :id_reserva',
        { id_reserva }
      )
      .getMany();
    return servicios;
  }
}