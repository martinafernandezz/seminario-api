import request from 'supertest';
import { app } from '../../app.js';

describe('Auth Routes', () => {

  describe('POST /api/auth/login', () => {

    test('debe rechazar login con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'usuario_falso', password: 'password_falso' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('debe rechazar login sin body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

  });

  describe('Rutas inexistentes', () => {

    test('debe retornar 404 para rutas que no existen', async () => {
      const response = await request(app)
        .get('/api/ruta-que-no-existe');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Endpoint not found');
    });

  });


});
