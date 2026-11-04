import { AppDataSource } from '../database/data-source.js';
import { Cancha, CanchaCreate, CanchaUpdate } from './cancha.entity.js';

export class CanchaRepository {
  private repository = AppDataSource.getRepository(Cancha);

  async findAll(): Promise<Cancha[]> {
    return this.repository.find({ relations: ['tipo_cancha', 'localidad'] });
  }

  async findById(id_cancha: number): Promise<Cancha | null> {
    return this.repository.findOne({
      where: { id_cancha },
      relations: ['tipo_cancha', 'localidad']
    });
  }

  async findByTipo(id_tipo: number): Promise<Cancha[]> {
    return this.repository.find({
      where: { id_tipo },
      relations: ['tipo_cancha', 'localidad']
    });
  }

  async findByLocalidad(id_localidad: number): Promise<Cancha[]> {
    return this.repository.find({
      where: { id_localidad },
      relations: ['tipo_cancha', 'localidad']
    });
  }

  async findByEstado(estado: 'disponible' | 'ocupada' | 'mantenimiento'): Promise<Cancha[]> {
    return this.repository.find({
      where: { estado },
      relations: ['tipo_cancha', 'localidad']
    });
  }

  async create(data: CanchaCreate): Promise<Cancha> {
    const cancha = this.repository.create(data);
    return this.repository.save(cancha);
  }

  async update(id_cancha: number, data: CanchaUpdate): Promise<Cancha | null> {
    await this.repository.update({ id_cancha }, data);
    return this.repository.findOne({
      where: { id_cancha },
      relations: ['tipo_cancha', 'localidad']
    });
  }

  async delete(id_cancha: number): Promise<void> {
    await this.repository.delete({ id_cancha });
  }

  async findByNombre(nombre: string): Promise<Cancha | null> {
    return this.repository.findOne({
      where: { nombre },
      relations: ['tipo_cancha', 'localidad']
    });
  }

  async findDisponibles(): Promise<Cancha[]> {
    return this.repository.find({
      where: { estado: 'disponible' },
      relations: ['tipo_cancha', 'localidad']
    });
  }
}