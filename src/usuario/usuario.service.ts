import { UsuarioRepository } from './usuario.repository.js';
import { Usuario, UsuarioCreate, UsuarioUpdate } from './usuario.entity.js';
import { RolUsuario } from './usuario.entity.js';

export class UsuarioService {
  constructor(private repository: UsuarioRepository) {}

  async crearUsuario(data: UsuarioCreate): Promise<Usuario> {
    return this.repository.create(data);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.repository.findAll();
  }

  async obtenerPorId(id_usuario: number): Promise<Usuario> {
    const usuario = await this.repository.findById(id_usuario);
    if (!usuario) throw new Error('Usuario no encontrado');
    return usuario;
  }

  async obtenerPorDni(dni: string): Promise<Usuario> {
    const usuario = await this.repository.findByDni(dni);
    if (!usuario) throw new Error('Usuario no encontrado');
    return usuario;
  }
async obtenerPorRol(rol: RolUsuario): Promise<Usuario[]> {
    return this.repository.findByRol(rol);
  }

 async actualizar(id: number, datos: UsuarioUpdate): Promise<Usuario> {
    const usuarioExistente = await this.repository.findById(id);
    if (!usuarioExistente) throw new Error('Usuario no encontrado');
    return this.repository.update(id, datos);
  }


  async eliminarUsuario(id_usuario: number): Promise<void> {
    const usuarioExistente = await this.repository.findById(id_usuario);
    if (!usuarioExistente) throw new Error('Usuario no encontrado');
    await this.repository.delete(id_usuario);
  }
}
