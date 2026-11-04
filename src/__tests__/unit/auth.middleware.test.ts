import { Request, NextFunction } from 'express';
import { authenticateToken, requireAdmin } from '../../auth/auth.middleware.js';
import { JwtService } from '../../auth/jwt.service.js';

const jwtService = new JwtService();

// Funciones helper para crear objetos falsos de Express
const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = () => jest.fn() as NextFunction;



describe('authenticateToken', () => {

    test('debe permitir acceso con token válido', () => {
    const token = jwtService.generateToken({ id_usuario: 1, username: 'testuser', rol: 'cliente' });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockRes();
    const next = mockNext();

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();        // Pasó al siguiente middleware
    expect(req.user).toBeDefined();         //  Se guardó el usuario
    expect(req.user?.username).toBe('testuser');
  });

  test('debe rechazar si no hay token', () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = mockNext();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401); //  Sin token = 401
    expect(next).not.toHaveBeenCalled();
  });

  test('debe rechazar con token inválido', () => {
    const req = { headers: { authorization: 'Bearer token_falso' } } as Request;
    const res = mockRes();
    const next = mockNext();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403); //  Token inválido = 403
    expect(next).not.toHaveBeenCalled();
  });

});



describe('requireAdmin', () => {

  test('debe permitir acceso a administradores', () => {
    const req = { user: { id_usuario: 1, username: 'admin', rol: 'administrador' } } as Request;
    const res = mockRes();
    const next = mockNext();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled(); //  Admin pasa
  });

  test('debe rechazar acceso a clientes', () => {
    const req = { user: { id_usuario: 2, username: 'cliente', rol: 'cliente' } } as Request;
    const res = mockRes();
    const next = mockNext();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403); //  Cliente bloqueado
    expect(next).not.toHaveBeenCalled();
  });

});
