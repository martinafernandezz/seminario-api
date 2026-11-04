import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id_usuario: number;
  username: string;
  rol: 'administrador' | 'cliente';
}

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiame';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class JwtService {
  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expirado');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token inválido');
      }
      throw new Error('Error al verificar token');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
}