# TP - SEMINARIO INTEGRADOR (BACKEND)

API REST para reservas de canchas deportivas.

Stack actual:

- Node.js
- TypeScript
- Express
- PostgreSQL
- TypeORM
- JWT
- Jest + Supertest
- Swagger (OpenAPI)



## requisitos

- Node.js 18+
- pnpm
- PostgreSQL 13+



1. repositorio:


cd seminario-api
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Crear archivo de entorno:
.env.example .env


4. base de datos

```bash
createdb -U postgres olimpo
psql -U postgres -d olimpo -f database/schema.sql
psql -U postgres -d olimpo -f database/seed.sql
psql -U postgres -d olimpo -f database/usuarios.sql
```

En pgAdmin: crear la base `olimpo` y ejecutar los tres archivos en ese orden
desde el query

5. levantar

```bash
pnpm start:dev
```

## Variables De Entorno

Base (archivo .env):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=olimpo
JWT_EXPIRES_IN=24h
```


