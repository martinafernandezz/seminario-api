# TP DSW - Backend

API REST para reservas de canchas deportivas.

Stack actual:

- Node.js
- TypeScript
- Express
- MySQL
- TypeORM
- JWT
- Jest + Supertest
- Swagger (OpenAPI)

## Qué Hace El Proyecto

- Registro, login y refresh de token JWT.
- Gestión de usuarios con control por rol y ownership.
- ABM de canchas, tipos de cancha, localidades, servicios y precios.
- Gestión de reservas con cálculo automático de precio total.
- Asignación y desasignación de servicios a reservas.
- Búsqueda de canchas por filtros y consulta de disponibilidad.
- Módulo de pagos con endpoints de creación/procesamiento/simulación.

## Requisitos

- Node.js 18+
- pnpm
- MySQL 8+

## Instalación Rápida

1. Clonar repositorio:

```bash
git clone https://github.com/RamiroFalcon/TP-DSW-Back-End.git
cd TP-DSW-Back-End
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Crear archivo de entorno:

```bash
# Linux/Mac
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

4. Crear y poblar base de datos:

```bash
mysql -u root -p
```

Dentro de MySQL:

```sql
source docs/mysql-commands.sql;
```

Opcional, para insertar precios por tipo de cancha:

```sql
source scripts/insertar-precios.sql;
```

5. Levantar en desarrollo:

```bash
pnpm start:dev
```

## Variables De Entorno

Base (archivo .env):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tp

JWT_SECRET=cambiame_por_un_valor_aleatorio_muy_largo
JWT_EXPIRES_IN=24h
```

Para tests existe .env.test con NODE_ENV=test.

Nota:

- La app actualmente escucha en el puerto 3000 fijo en src/app.ts.
- La variable PORT no se usa para levantar el servidor en runtime.

## Scripts Disponibles

```bash
pnpm start:dev      # Desarrollo con watch
pnpm dev            # Desarrollo sin watch
pnpm build          # Compilar TypeScript -> dist
pnpm start          # Ejecutar build compilado
pnpm watch          # tsc --watch

pnpm test           # Tests
pnpm test:watch     # Tests en watch
pnpm test:coverage  # Coverage
pnpm test:verbose   # Salida detallada
```

## Estructura Del Código

```text
src/
  app.ts
  swagger.ts
  auth/
  busqueda-cancha/
  cancha/
  database/
  disponibilidad/
  localidad/
  pago/
  precio/
  reserva/
  reserva-servicio/
  servicio/
  tipo_cancha/
  usuario/
  __tests__/
```

## Endpoints Reales

Base URL: http://localhost:3000

Autenticación:

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

Usuarios (con middleware de auth/roles):

- GET /api/usuarios (admin)
- GET /api/usuarios/:id (owner o admin)
- POST /api/usuarios (admin)
- PATCH /api/usuarios/:id (owner o admin)
- DELETE /api/usuarios/:id (admin)

Canchas:

- POST /api/canchas
- GET /api/canchas
- GET /api/canchas/:id
- GET /api/canchas/disponibilidad
- GET /api/canchas/tipo/:id_tipo
- PUT /api/canchas/:id
- DELETE /api/canchas/:id

Reservas:

- POST /api/reservas
- GET /api/reservas
- GET /api/reservas/:id
- PUT /api/reservas/:id
- DELETE /api/reservas/:id
- GET /api/reservas/:id_reserva/servicios
- POST /api/reservas/:id/servicios
- DELETE /api/reservas/:id/servicios/:id_servicio
- POST /api/reservas/calcular-precio

Reserva-servicio:

- POST /reserva-servicio
- GET /reserva-servicio/:id_reserva
- DELETE /reserva-servicio/:id_reserva/:id_servicio

Tipos de cancha:

- POST /api/tipo-canchas
- GET /api/tipo-canchas
- GET /api/tipo-canchas/:id
- PUT /api/tipo-canchas/:id
- PATCH /api/tipo-canchas/:id
- DELETE /api/tipo-canchas/:id

Localidades:

- POST /api/localidades
- GET /api/localidades
- GET /api/localidades/:id
- PUT /api/localidades/:id
- DELETE /api/localidades/:id

Servicios:

- GET /api/servicios
- GET /api/servicios/:id
- POST /api/servicios
- PUT /api/servicios/:id
- DELETE /api/servicios/:id
- POST /api/servicios/reserva/:id_reserva
- GET /api/servicios/reserva/:id_reserva

Precios:

- GET /api/precios
- GET /api/precios/cancha/:id_cancha
- GET /api/precios/actual/:id_cancha
- POST /api/precios
- PUT /api/precios/:id_precio
- DELETE /api/precios/:id_precio

Pagos:

- POST /api/pagos
- GET /api/pagos/:id
- GET /api/pagos/reserva/:id_reserva
- PUT /api/pagos/:id/procesar
- POST /api/pagos/:id/simular
- GET /api/pagos
- PUT /api/pagos/:id

Disponibilidad y búsqueda:

- GET /api/disponibilidad/:id_cancha/:fecha
- GET /api/disponibilidad?id_cancha={id}&fecha={yyyy-mm-dd}
- GET /api/buscar-canchas?deporte={deporte}&localidad={localidad}&fecha={yyyy-mm-dd}
- POST /api/buscar-canchas

Swagger:

- GET /api/docs

## Ejemplo De Login

Request:

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "cliente",
  "password": "cliente123"
}
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "<jwt>",
  "user": {
    "id_usuario": 1,
    "username": "cliente",
    "nombre": "Martin",
    "apellido": "Palermo",
    "email": "cliente@turnosport.com",
    "rol": "cliente"
  }
}
```

## Tests

Archivos de prueba actuales:

- src/__tests__/unit/jwt.service.test.ts
- src/__tests__/unit/auth.middleware.test.ts
- src/__tests__/integration/auth.routes.test.ts

Configuración:

- Jest con ts-jest
- Entorno Node
- setup en src/__tests__/setup.ts

## Base De Datos

Tablas principales creadas por docs/mysql-commands.sql:

- usuario
- localidad
- tipocancha
- cancha
- reserva
- servicio
- reserva_servicio
- precio
- pago

Notas técnicas:

- Hay DataSource de TypeORM en src/database/data-source.ts.
- synchronize está en false.

## Usuarios De Prueba Incluidos En SQL

- cliente / cliente123 (cliente)
- admin / admin123 (administrador)
- cliente2 / cliente321 (cliente)
- martina / marti123 (administrador)

## Documentación Complementaria

- ARQUITECTURA.md
- docs/JWT-IMPLEMENTATION.md
- docs/mysql-commands.sql

Repositorio:

https://github.com/RamiroFalcon/TP-DSW-Back-End

