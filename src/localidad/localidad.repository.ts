import { AppDataSource } from '../database/data-source.js';
import { Localidad, LocalidadCreate } from './localidad.entity.js';

export class LocalidadRepository {
  private repository = AppDataSource.getRepository(Localidad);

  async create(data: LocalidadCreate): Promise<Localidad> {
    const localidad = this.repository.create(data);
    return this.repository.save(localidad);
  }

  async findAll(): Promise<Localidad[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Localidad | undefined> {
    const localidad = await this.repository.findOne({ where: { id } });
    return localidad ?? undefined;
  }

  async update(id: number, nombre: string): Promise<Localidad | null> {
    await this.repository.update(id, { nombre });
    const localidad = await this.repository.findOne({ where: { id } });
    return localidad ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}