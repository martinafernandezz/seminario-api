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

  async update(id_precio: number, precioData: PrecioUpdate): Promise<Precio | null> {
    await this.repository.update({ id_precio }, precioData);
    return this.repository.findOne({
      where: { id_precio },
      relations: ['cancha']
    });
  }

  async delete(id_precio: number): Promise<void> {
    await this.repository.delete({ id_precio });
  }

  async findById(id_precio: number): Promise<Precio | null> {
    return this.repository.findOne({
      where: { id_precio },
      relations: ['cancha']
    });
  }
}