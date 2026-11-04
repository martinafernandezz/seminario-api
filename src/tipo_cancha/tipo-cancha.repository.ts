import { AppDataSource } from '../database/data-source.js';
import { TipoCancha, TipoCanchaCreate } from './tipo-cancha.entity.js';


export class TipoCanchaRepository {
  private repository = AppDataSource.getRepository(TipoCancha);

  async findAll(): Promise<TipoCancha[]> {
    return this.repository.find();
  }

  async findById(id_tipo: number): Promise<TipoCancha | null> {
    const tipo = await this.repository.findOne({ where: { id_tipo } });
    return tipo ?? null;
  }

  async create(data: TipoCanchaCreate): Promise<TipoCancha> {
    const tipo = this.repository.create(data);
    return this.repository.save(tipo);
  }

  async update(id: number, datos: Partial<TipoCancha>): Promise<TipoCancha> {
    await this.repository.update(id, datos);
    const tipo = await this.repository.findOne({ where: { id_tipo: id } });
    if (!tipo) {
      throw new Error('Tipo de cancha no encontrado');
    }
    return tipo;

  }

  async delete(id_tipo: number): Promise<void> {
    await this.repository.delete(id_tipo);
  }
}