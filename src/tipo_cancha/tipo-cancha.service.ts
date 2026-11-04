import { TipoCanchaRepository } from './tipo-cancha.repository.js';
import { TipoCancha, TipoCanchaCreate, TipoCanchaUpdate } from './tipo-cancha.entity.js';

export class TipoCanchaService {
  constructor(private repository: TipoCanchaRepository) {}

  async crearTipoCancha(data: TipoCanchaCreate): Promise<TipoCancha> {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre del tipo de cancha es requerido');
    }
    if (!data.deporte || data.deporte.trim().length === 0) {
      throw new Error('El deporte es requerido');
    }
    return await this.repository.create(data);
  }

  async obtenerTodos(): Promise<TipoCancha[]> {
    return await this.repository.findAll();
  }

  async obtenerPorId(id: number): Promise<TipoCancha> {
    const tipo = await this.repository.findById(id);
    if (!tipo) {
      throw new Error(`Tipo de cancha con id ${id} no encontrado`);
    }
    return tipo;
  }

  async actualizarTipoCancha(id: number, data: TipoCanchaUpdate): Promise<TipoCancha> {
    const tipo = await this.repository.update(id, data);
    if (!tipo) {
      throw new Error(`Tipo de cancha con id ${id} no encontrado`);
    }
    return tipo;
  }

async eliminarTipoCancha(id: number): Promise<void> {
  const tipo = await this.repository.findById(id);
  if (!tipo) {
    throw new Error(`Tipo de cancha con id ${id} no encontrado`);
  }
  await this.repository.delete(id);
} 

}