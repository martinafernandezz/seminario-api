import 'dotenv/config';
import express from 'express';
import 'reflect-metadata';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import canchaRouter from './cancha/cancha.routes.js';
import usuarioRouter from './usuario/usuario.routes.js';
import tipoCanchaRouter from './tipo_cancha/tipo-cancha.routes.js';
import localidadRouter from './localidad/localidad.routes.js';
import reservaRouter from './reserva/reserva.routes.js';
import precioRoutes from './precio/precio.routes.js';
import servicioRoutes from './servicio/servicio.routes.js';
import reservaServicioRoutes from './reserva-servicio/reserva-servicio.routes.js';
import authRouter from './auth/auth.routes.js';
import pagoRouter from './pago/pago.routes.js';
import disponibilidadRouter from './disponibilidad/disponibilidad.routes.js';
import busquedaCanchaRouter from './busqueda-cancha/busqueda-cancha.routes.js';
import { AppDataSource } from './database/data-source.js';


if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(() => {
      console.log('TypeORM conectado a MySQL');
    })
    .catch((error) => {
      console.error('Error al conectar con MySQL:', error);
    });
}


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/canchas', canchaRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/tipo-canchas', tipoCanchaRouter);
app.use('/api/localidades', localidadRouter);
app.use('/api/reservas', reservaRouter);
app.use('/api/precios', precioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/reserva-servicio', reservaServicioRoutes);
app.use('/api/auth', authRouter);
app.use('/api/pagos', pagoRouter);
app.use('/api/disponibilidad', disponibilidadRouter);
app.use('/api/buscar-canchas', busquedaCanchaRouter);

// Manejador de rutas inexistentes
app.use((_, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export { app }; // ← Agregamos esto

// Solo levanta el servidor si no estamos en tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
  });
}


