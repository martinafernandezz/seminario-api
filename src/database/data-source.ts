import { DataSource } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity.js';
import { Localidad } from '../localidad/localidad.entity.js';
import { TipoCancha } from '../tipo_cancha/tipo-cancha.entity.js';
import { Cancha } from '../cancha/cancha.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';
import { Precio } from '../precio/precio.entity.js';
import { Pago } from '../pago/pago.entity.js';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'tp',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Usuario, Localidad, TipoCancha, Cancha, Servicio, Reserva, Precio, Pago],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});