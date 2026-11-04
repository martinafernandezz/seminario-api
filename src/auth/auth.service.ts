import { UsuarioRepository } from '../usuario/usuario.repository.js';
import { UsuarioCreate } from '../usuario/usuario.entity.js';
import bcrypt from 'bcrypt';
import { JwtService } from './jwt.service.js';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id_usuario: number;
    username: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: 'administrador' | 'cliente';
  };
}

export class AuthService {
  private jwtService: JwtService;

  constructor(private usuarioRepository: UsuarioRepository) {
    this.jwtService = new JwtService();
  }

  async register(data: UsuarioCreate): Promise<LoginResponse> {
    // Validar campos obligatorios
    if (!data.username || !data.password || !data.email) {
      throw new Error('Username, password y email son obligatorios');
    }

    // Verificar que el username no exista
    const existingUsername = await this.usuarioRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear usuario con contraseña hasheada
    const newUser = await this.usuarioRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generar token JWT
    const token = this.jwtService.generateToken({
      id_usuario: newUser.id_usuario,
      username: newUser.username!,
      rol: newUser.rol,
    });

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id_usuario: newUser.id_usuario,
        username: newUser.username!,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        email: newUser.email!,
        rol: newUser.rol,
      },
    };
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { username, password } = credentials;

    // Buscar usuario
    const usuario = await this.usuarioRepository.findByUsername(username);
    
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Validar que tenga contraseña (no debería ser null)
    if (!usuario.password) {
      throw new Error('Error en configuración de usuario');
    }

    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = this.jwtService.generateToken({
      id_usuario: usuario.id_usuario,
      username: usuario.username!,
      rol: usuario.rol,
    });

    return {
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id_usuario: usuario.id_usuario,
        username: usuario.username!,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email!,
        rol: usuario.rol,
      },
    };
  }

  async refreshToken(oldToken: string): Promise<{ token: string }> {
    const payload = this.jwtService.verifyToken(oldToken);
    const newToken = this.jwtService.generateToken(payload);
    return { token: newToken };
  }
}