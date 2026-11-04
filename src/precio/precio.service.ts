import { PrecioRepository } from './precio.repository.js';
import { Precio, PrecioCreate } from './precio.entity.js';

export class PrecioService {
  private repository: PrecioRepository;

  constructor(repository: PrecioRepository) {
    this.repository = repository;
  }

  async crear(precioData: PrecioCreate): Promise<Precio> {
    try {
      console.log('📝 Creando precio:', precioData);
      const precio = await this.repository.create(precioData);
      console.log('✅ Precio creado:', precio);
      return precio;
    } catch (error) {
      console.error('❌ Error en PrecioService.crear:', error);
      throw error;
    }
  }

  async obtenerTodos(): Promise<Precio[]> {
    try {
      console.log('📋 Obteniendo todos los precios');
      const precios = await this.repository.findAll();
      console.log(`✅ Encontrados ${precios.length} precios`);
      return precios;
    } catch (error) {
      console.error('❌ Error en PrecioService.obtenerTodos:', error);
      throw error;
    }
  }

  async obtenerPorCancha(id_cancha: number): Promise<Precio[]> {
    try {
      const precios = await this.repository.findByCancha(id_cancha);
      return precios;
    } catch (error) {
      console.error('Error en PrecioService.obtenerPorCancha:', error);
      throw error;
    }
  }

  async obtenerPrecioActual(id_cancha: number): Promise<Precio | null> {
    try {
      return await this.repository.findActualByCancha(id_cancha);
    } catch (error) {
      console.error('Error en PrecioService.obtenerPrecioActual:', error);
      throw error;
    }
  }

  async actualizar(id_precio: number, precioData: Partial<Precio>): Promise<Precio> {
    try {
      console.log('✏️ Actualizando precio:', id_precio, precioData);
      await this.repository.update(id_precio, precioData);
      const precioActualizado = await this.repository.findById(id_precio);
      if (!precioActualizado) {
        throw new Error('No se pudo encontrar el precio actualizado');
      }
      console.log('✅ Precio actualizado:', precioActualizado);
      return precioActualizado;
    } catch (error) {
      console.error('❌ Error en PrecioService.actualizar:', error);
      throw error;
    }
  }

  async eliminar(id_precio: number): Promise<void> {
    try {
      console.log('🗑️ Eliminando precio:', id_precio);
      await this.repository.delete(id_precio);
      console.log('✅ Precio eliminado');
    } catch (error) {
      console.error('❌ Error en PrecioService.eliminar:', error);
      throw error;
    }
  }

  async obtenerPorId(id_precio: number): Promise<Precio | null> {
    try {
      return await this.repository.findById(id_precio);
    } catch (error) {
      console.error('Error en PrecioService.obtenerPorId:', error);
      throw error;
    }
  }
}