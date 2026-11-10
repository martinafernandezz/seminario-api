import { AppDataSource } from '../database/data-source.js';
import { Precio, PrecioCreate, PrecioUpdate } from './precio.entity.js';

export class PrecioRepository {
  private repository = AppDataSource.getRepository(Precio);

  async create(precio: PrecioCreate): Promise<Precio> {
    const precioEntity = this.repository.create(precio);
    return this.repository.save(precioEntity);
  }

  async findAll(): Promise<Precio[]> {
    return this.repository.find({
      relations: ['cancha'],
      order: { fecha_vigencia: 'DESC' }
    });
  }

  async findByCancha(id_cancha: number): Promise<Precio[]> {
    return this.repository.find({
      where: { id_cancha },
      relations: ['cancha'],
      order: { fecha_vigencia: 'DESC' }
    });
  }

  async findActualByCancha(id_cancha: number): Promise<Precio | null> {
    return this.repository.findOne({
      where: { id_cancha },
      relations: ['cancha'],
      order: { fecha_vigencia: 'DESC' }
    });
  }

  async update(id_cancha: number, fecha_vigencia: string, precioData: PrecioUpdate): Promise<Precio | null> {
    await this.repository.update({ id_cancha, fecha_vigencia }, precioData);
    return this.findById(id_cancha, fecha_vigencia);
  }

  async delete(id_cancha: number, fecha_vigencia: string): Promise<void> {
    await this.repository.delete({ id_cancha, fecha_vigencia });
  }

  async findById(id_cancha: number, fecha_vigencia: string): Promise<Precio | null> {
    return this.repository.findOne({
      where: { id_cancha, fecha_vigencia },
      relations: ['cancha']
    });
  }
}