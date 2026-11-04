import { AppDataSource } from '../database/data-source.js';
import { Usuario } from './usuario.entity.js';

export class UsuarioRepository {
  private repository = AppDataSource.getRepository(Usuario);

  async findAll(): Promise<Usuario[]> {
    return this.repository.find();
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findById(id_usuario: number): Promise<Usuario | null> {
    return this.repository.findOne({ where: { id_usuario } });
  }

  async findByDni(dni: string): Promise<Usuario | null> {
    return this.repository.findOne({ where: { dni } });
  }

  async findByRol(rol: 'administrador' | 'cliente'): Promise<Usuario[]> {
    return this.repository.find({ where: { rol } });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    if (!data.email || !data.username || !data.password) {
      throw new Error('Email, username y password son campos obligatorios');
    }
    
    const usuario = this.repository.create(data);
    return this.repository.save(usuario);
  }

  async update(id: number, datos: Partial<Usuario>): Promise<Usuario> {
    await this.repository.update(id, datos);
    
    const usuario = await this.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    return usuario;
  }

  async delete(id_usuario: number): Promise<void> {
    await this.repository.delete(id_usuario);
  }
}