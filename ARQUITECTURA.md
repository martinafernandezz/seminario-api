# Arquitectura del Backend - Sistema de Reservas de Canchas

## Índice
1. [Visión General](#visión-general)
2. [Arquitectura en Capas](#arquitectura-en-capas)
3. [Módulos del Sistema](#módulos-del-sistema)
4. [Autenticación JWT](#autenticación-jwt)
5. [Persistencia y Base de Datos](#persistencia-y-base-de-datos)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Patrones Implementados](#patrones-implementados)

---

## Visión General

Backend para gestión de reservas de canchas deportivas construido con:

- Node.js + TypeScript + Express
- MySQL
- TypeORM
- JWT + bcrypt
- Jest + Supertest

Principios arquitectónicos:

- Arquitectura en capas
- Separación de responsabilidades
- Modelo de dominio tipado
- Repositorios por módulo

---

## Arquitectura en Capas

```
Cliente -> Routes -> Controller -> Service -> Repository -> TypeORM -> MySQL
```

Capas principales:

1. Routes: define endpoints y conecta middlewares.
2. Controller: maneja contrato HTTP (request/response).
3. Service: concentra reglas de negocio.
4. Repository: encapsula acceso a datos con TypeORM.

Flujo ejemplo (crear reserva):

1. Cliente invoca `POST /api/reservas`.
2. Route deriva al controller.
3. Controller delega al service.
4. Service calcula precio total (cancha + servicios).
5. Repository persiste reserva y relaciones N:M.
6. Controller responde 201 con payload final.

---

## Módulos del Sistema

Módulos principales del dominio:

1. Auth
- Registro y login con contraseñas hasheadas (bcrypt).
- Emisión y refresh de JWT.
- Middlewares: authenticateToken, requireAdmin, requireOwnerOrAdmin.

2. Reserva
- Cálculo automático de precio total.
- Gestión de servicios asociados.
- Validaciones de disponibilidad y estado de pago.

3. Disponibilidad
- Generación de franjas horarias por cancha/fecha.
- Detección de solapamientos con reservas existentes.

4. Búsqueda de Cancha
- Filtros por deporte, localidad y fecha.
- Integración con disponibilidad para respuesta enriquecida.

5. Usuario
- CRUD con reglas por rol y ownership.

6. Cancha, Servicio, Precio, Pago, Localidad, Tipo Cancha, Reserva-Servicio
- Operaciones de negocio y mantenimiento de catálogos.

---

## Autenticación JWT

Flujo:

1. Usuario envía username y password.
2. Service valida credenciales con bcrypt.
3. Si es válido, se genera JWT con payload `{ id_usuario, username, rol }`.
4. Cliente envía token en `Authorization: Bearer <token>`.

Middlewares:

- authenticateToken: valida token y carga usuario en request.
- requireAdmin: restringe endpoints a rol administrador.
- requireOwnerOrAdmin: permite dueño del recurso o administrador.

Configuración por entorno:

- `JWT_SECRET`
- `JWT_EXPIRES_IN`

---

## Persistencia y Base de Datos

El proyecto utiliza TypeORM como capa de acceso a datos, con MySQL como motor.

Configuración central:

- `src/database/data-source.ts` define `AppDataSource`.
- `synchronize: false` para evitar cambios automáticos en esquema.
- Entidades registradas explícitamente en DataSource.

Inicialización de conexión:

- La app inicializa TypeORM al arrancar en modo normal.
- En `NODE_ENV=test` se evita inicialización automática para no interferir con Jest.

Modelo relacional simplificado:

```
usuario -> reserva <- cancha
           |
           +-> pago

reserva <-> servicio (reserva_servicio)
cancha -> precio (historial por vigencia)
cancha -> tipocancha
cancha -> localidad
```

Relaciones clave:

- usuario 1:N reserva
- cancha 1:N reserva
- reserva N:M servicio (tabla intermedia reserva_servicio)
- cancha 1:N precio

---

## Testing

Stack:

- Jest
- ts-jest
- Supertest

Estructura:

```
src/__tests__/
  unit/
    jwt.service.test.ts
    auth.middleware.test.ts
  integration/
    auth.routes.test.ts
```

Notas:

- Setup global en `src/__tests__/setup.ts`.
- Pruebas actuales validan autenticación, middlewares y rutas base de auth.
- La suite se ejecuta sin pool MySQL manual, alineada con uso de TypeORM.

---

## Deployment

Variables mínimas:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tp

JWT_SECRET=clave_secreta_segura
JWT_EXPIRES_IN=24h

NODE_ENV=production
```

Build y ejecución:

```bash
pnpm install --production
pnpm build
pnpm start
```

Recomendaciones para producción:

- JWT secret robusto y rotación planificada.
- HTTPS obligatorio.
- CORS con orígenes explícitos.
- Rate limiting en endpoints públicos.
- Observabilidad y logging estructurado.
- Backups automáticos de MySQL.

---

## Patrones Implementados

Repository Pattern:

- Cada módulo encapsula su acceso a datos en repositorios TypeORM.
- Services no dependen de SQL embebido.

DTO/Interfaces por caso de uso:

- Entidades y contratos de creación/actualización separados.

Dependency Injection simple:

- Services reciben repositorios por constructor o inicialización controlada.

---

## Conclusión

La arquitectura actual mantiene una estructura en capas clara, con autenticación JWT, lógica de reservas centralizada y persistencia homogénea con TypeORM. El diseño favorece mantenibilidad, pruebas y evolución incremental del dominio.

Documentación relacionada:

- [README.md](README.md)
- [docs/JWT-IMPLEMENTATION.md](docs/JWT-IMPLEMENTATION.md)
- [docs/mysql-commands.sql](docs/mysql-commands.sql)

