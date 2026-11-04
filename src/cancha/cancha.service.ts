import { CanchaRepository } from './cancha.repository.js';
import { Cancha, CanchaCreate, CanchaUpdate } from './cancha.entity.js';

export class CanchaService {
  constructor(private repository: CanchaRepository) {}

  async crearCancha(data: CanchaCreate): Promise<Cancha> {
    return this.repository.create(data);
  }

  async obtenerTodas(): Promise<Cancha[]> {
    return this.repository.findAll();
  }

  async obtenerPorId(id: number): Promise<Cancha> {
    const cancha = await this.repository.findById(id);
    if (!cancha) throw new Error('Cancha no encontrada');
    return cancha;
  }

  async obtenerPorTipo(id_tipo: number): Promise<Cancha[]> {
    return this.repository.findByTipo(id_tipo);
  }

  async actualizarCancha(id: number, data: CanchaUpdate): Promise<Cancha> {
    const canchaExistente = await this.repository.findById(id);
    if (!canchaExistente) throw new Error('Cancha no encontrada');
    await this.repository.update(id, data);
    return { ...canchaExistente, ...data };
  }

  async eliminarCancha(id: number): Promise<void> {
    const canchaExistente = await this.repository.findById(id);
    if (!canchaExistente) throw new Error('Cancha no encontrada');
    await this.repository.delete(id);
  }
}
