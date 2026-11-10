import { Request, Response } from 'express';
import { UsuarioService } from './usuario.service.js';
import { RolUsuario, Usuario } from './usuario.entity.js';

// nunca devolver el hash de la clave
const sinPassword = (u: Usuario) => {
  const { password, ...resto } = u;
  return resto;
};


export class UsuarioController {
  constructor(private service: UsuarioService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuario = await this.service.crearUsuario(req.body);
      res.status(201).json({
        success: true,
        data: sinPassword(usuario),
        message: 'Usuario creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear usuario'
      });
    }
  };

  obtenerTodos = async (_: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await this.service.obtenerTodos();
      res.status(200).json({
        success: true,
        data: usuarios.map(sinPassword)
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios'
      });
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_usuario = parseInt(req.params.id_usuario);
      const usuario = await this.service.obtenerPorId(id_usuario);
      res.status(200).json({ success: true, data: sinPassword(usuario) });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  };

  obtenerPorDni = async (req: Request, res: Response): Promise<void> => {
    try {
      const dni = parseInt(req.params.dni);
      const usuario = await this.service.obtenerPorDni(dni);
      res.status(200).json({ success: true, data: sinPassword(usuario) });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  };

   obtenerPorRol = async (req: Request, res: Response): Promise<void> => {
    try {
      const rolParam = req.params.rol;

      // Validar que el rol exista
      const rolesValidos = Object.values(RolUsuario);
      if (!rolesValidos.includes(rolParam as RolUsuario)) {
        res.status(400).json({ success: false, message: 'Rol inválido' });
        return;
      }

      const usuarios = await this.service.obtenerPorRol(rolParam as RolUsuario);
      res.json({ success: true, data: usuarios.map(sinPassword) });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener usuarios por rol' });
    }
  };


  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_usuario = parseInt(req.params.id_usuario);
      const usuarioActualizado = await this.service.actualizar(id_usuario, req.body);
      res.status(200).json({
        success: true,
        data: sinPassword(usuarioActualizado),
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar usuario'
      });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_usuario = parseInt(req.params.id_usuario);
      await this.service.eliminarUsuario(id_usuario);
      res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Usuario no encontrado'
      });
    }
  };
}
