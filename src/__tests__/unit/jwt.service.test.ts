import { JwtService, JwtPayload } from '../../auth/jwt.service.js';

describe('JwtService', () => {
  let jwtService: JwtService;

  const testPayload: JwtPayload = {
    id_usuario: 1,
    username: 'testuser',
    rol: 'cliente',
  };

  beforeEach(() => {
    jwtService = new JwtService();
  });

  //  generateToken 

  describe('generateToken', () => {
    test('debe generar un token JWT con formato válido (3 partes separadas por puntos)', () => {
      const token = jwtService.generateToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    test('debe generar tokens distintos para payloads distintos', () => {
      const otroPayload: JwtPayload = { id_usuario: 2, username: 'otrouser', rol: 'administrador' };

      const token1 = jwtService.generateToken(testPayload);
      const token2 = jwtService.generateToken(otroPayload);

      // Payloads distintos siempre producen tokens distintos
      expect(token1).not.toBe(token2);
    });

    test('debe generar tokens para el rol administrador', () => {
      const adminPayload: JwtPayload = { ...testPayload, rol: 'administrador' };
      const token = jwtService.generateToken(adminPayload);

      expect(token).toBeDefined();
      expect(token.split('.')).toHaveLength(3);
    });
  });

  // verifyToken 

  describe('verifyToken', () => {
    test('debe retornar el payload original al verificar un token válido', () => {
      const token = jwtService.generateToken(testPayload);
      const decoded = jwtService.verifyToken(token);

      expect(decoded.id_usuario).toBe(testPayload.id_usuario);
      expect(decoded.username).toBe(testPayload.username);
      expect(decoded.rol).toBe(testPayload.rol);
    });

    test('debe incluir las propiedades estándar de JWT (iat y exp)', () => {
      const token = jwtService.generateToken(testPayload);
      const decoded = jwtService.verifyToken(token) as any;

      expect(decoded).toHaveProperty('iat'); // issued at
      expect(decoded).toHaveProperty('exp'); // expiration
      expect(typeof decoded.iat).toBe('number');
      expect(typeof decoded.exp).toBe('number');
    });

    test('debe lanzar error con un token completamente inválido', () => {
      expect(() => jwtService.verifyToken('token_invalido')).toThrow('Token inválido');
    });

    test('debe lanzar error con un token vacío', () => {
      expect(() => jwtService.verifyToken('')).toThrow();
    });

    test('debe lanzar error con un token malformado', () => {
      expect(() => jwtService.verifyToken('a.b.c.d.e')).toThrow();
    });
  });

  // decodeToken 

  describe('decodeToken', () => {
    test('debe decodificar el token sin verificar la firma', () => {
      const token = jwtService.generateToken(testPayload);
      const decoded = jwtService.decodeToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.id_usuario).toBe(testPayload.id_usuario);
      expect(decoded?.username).toBe(testPayload.username);
    });

    test('debe retornar null con un token inválido', () => {
      const decoded = jwtService.decodeToken('token_invalido');
      expect(decoded).toBeNull();
    });
  });
});
