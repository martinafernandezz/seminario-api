import { AppDataSource } from '../database/data-source.js';
import { Pago, PagoCreate, PagoUpdate } from './pago.entity.js';

export class PagoRepository {
  private repository = AppDataSource.getRepository(Pago);

  async create(data: PagoCreate): Promise<Pago> {
    const pago = this.repository.create({
      ...data,
      estado: 'pendiente'
    });
    return this.repository.save(pago);
  }

  async findById(id_pago: number): Promise<Pago | null> {
    return this.repository.findOne({
      where: { id_pago },
      relations: ['reserva']
    });
  }

  async findByReserva(id_reserva: number): Promise<Pago | null> {
    return this.repository.findOne({
      where: { id_reserva },
      relations: ['reserva'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  async findAllByReserva(id_reserva: number): Promise<Pago[]> {
    return this.repository.find({
      where: { id_reserva },
      relations: ['reserva'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  async findByEstado(estado: 'pendiente' | 'completado' | 'fallido' | 'reembolsado'): Promise<Pago[]> {
    return this.repository.find({
      where: { estado },
      relations: ['reserva'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  async update(id_pago: number, data: PagoUpdate): Promise<Pago | null> {
    await this.repository.update({ id_pago }, data);
    return this.repository.findOne({
      where: { id_pago },
      relations: ['reserva']
    });
  }

  async updateEstadoByReserva(id_reserva: number, estado: string): Promise<void> {
    await this.repository.update({ id_reserva }, { estado: estado as any });
  }

  async delete(id_pago: number): Promise<void> {
    await this.repository.delete({ id_pago });
  }

  async findAll(): Promise<Pago[]> {
    return this.repository.find({
      relations: ['reserva'],
      order: { fecha_creacion: 'DESC' }
    });
  }
}