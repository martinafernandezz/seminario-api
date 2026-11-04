import { Request, Response, NextFunction } from 'express';
import { JwtService, JwtPayload } from './jwt.service.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const jwtService = new JwtService();

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido',
    });
  }

  try {
    const payload = jwtService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error instanceof Error ? error.message : 'Token inválido',
    });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado',
    });
  }

  if (req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador',
    });
  }

  next();
}

export function requireOwnerOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado',
    });
  }

  const userId = parseInt(req.params.id);

  if (req.user.rol === 'administrador' || req.user.id_usuario === userId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Solo puedes acceder a tus propios datos',
    });
  }
}