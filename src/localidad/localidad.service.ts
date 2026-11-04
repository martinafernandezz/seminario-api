import { LocalidadRepository } from './localidad.repository.js';
import { Localidad, LocalidadCreate, LocalidadUpdate } from './localidad.entity.js';

export class LocalidadService {
  constructor(private repository: LocalidadRepository) {}

  async crearLocalidad(data: LocalidadCreate): Promise<Localidad> {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre de la localidad es requerido');
    }
    
    if (data.nombre.length > 100) {
      throw new Error('El nombre de la localidad no puede exceder 100 caracteres');
    }

    return await this.repository.create(data);
  }

  async obtenerTodas(): Promise<Localidad[]> {
    return await this.repository.findAll();
  }

  async obtenerPorId(id: number): Promise<Localidad> {
    const localidad = await this.repository.findById(id);
    if (!localidad) {
      throw new Error(`Localidad con id ${id} no encontrada`);
    }
    return localidad;
  }

  async actualizarLocalidad(id: number, data: LocalidadUpdate): Promise<Localidad> {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre de la localidad es requerido');
    }

    if (data.nombre.length > 100) {
      throw new Error('El nombre de la localidad no puede exceder 100 caracteres');
    }

    const localidad = await this.repository.update(id, data.nombre);
    if (!localidad) {
      throw new Error(`Localidad con id ${id} no encontrada`);
    }
    return localidad;
  }

  async eliminarLocalidad(id: number): Promise<void> {
    const eliminado = await this.repository.delete(id);
    if (!eliminado) {
      throw new Error(`Localidad con id ${id} no encontrada`);
    }
  }
}