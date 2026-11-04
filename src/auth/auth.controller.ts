import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.service.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al registrar usuario',
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username y password son requeridos',
        });
      }

      const result = await this.service.login({ username, password });
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al iniciar sesión',
      });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token requerido',
        });
      }

      const result = await this.service.refreshToken(token);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token inválido',
      });
    }
  };
}