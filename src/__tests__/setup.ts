import { config } from 'dotenv';

// Cargar variables de entorno para tests
config({ path: '.env.test' });

// Aumentar timeout para tests de integración
jest.setTimeout(10000);