import { DataSource } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity.js';
import { TipoCancha } from '../tipo_cancha/tipo-cancha.entity.js';
import { Cancha } from '../cancha/cancha.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';
import { Precio } from '../precio/precio.entity.js';
import { Pago } from '../pago/pago.entity.js';
import { TurnoFijo } from '../turno_fijo/turno-fijo.entity.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'olimpo',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Usuario, TipoCancha, Cancha, Servicio, Reserva, Precio, Pago, TurnoFijo],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
