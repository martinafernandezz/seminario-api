# 🔐 Implementación de Autenticación JWT - Resumen

## ✅ ¿Qué se solucionó?

Se implementó un sistema completo de autenticación con JWT (JSON Web Tokens) y bcrypt para hasheo de contraseñas.

### Errores corregidos:

1. **Error de tipos en jwt.sign** - Se agregó cast explícito `as jwt.SignOptions`
2. **Propiedad incorrecta** - Se cambió `rol_usuario` por `rol` en toda la aplicación
3. **Método faltante** - No existía `findByEmail`, se validó solo por username
4. **Campos opcionales** - Se agregaron validaciones para campos nullable
5. **Importaciones ES6** - Se corrigió `import * as jwt` para compatibilidad

---

## 📁 Archivos creados:

### 1. `src/auth/jwt.service.ts`
**Responsabilidad:** Generar y verificar tokens JWT

**Métodos principales:**
- `generateToken(payload)` - Crea un token JWT válido por 24 horas
- `verifyToken(token)` - Valida un token y retorna los datos del usuario
- `decodeToken(token)` - Decodifica sin validar (útil para debug)

**Datos en el token:**
```typescript
{
  id_usuario: number,
  username: string,
  rol: 'administrador' | 'cliente'
}
```

---

### 2. `src/auth/auth.middleware.ts`
**Responsabilidad:** Proteger rutas HTTP verificando autenticación y permisos

**Middlewares disponibles:**

#### `authenticateToken`
Verifica que el usuario tenga un token JWT válido
```typescript
// Uso:
router.get('/perfil', authenticateToken, controller.getPerfil);
```

#### `requireAdmin`
Verifica que el usuario sea administrador (debe usarse DESPUÉS de authenticateToken)
```typescript
// Uso:
router.delete('/usuarios/:id', authenticateToken, requireAdmin, controller.eliminar);
```

#### `requireOwnerOrAdmin`
Permite acceso si es el propio usuario O si es admin
```typescript
// Uso:
router.get('/usuarios/:id', authenticateToken, requireOwnerOrAdmin, controller.obtenerPorId);
```

---

### 3. `src/auth/auth.service.ts` (actualizado)
**Responsabilidad:** Lógica de negocio de autenticación

**Cambios realizados:**
- ✅ Hash de contraseñas con bcrypt (10 rounds)
- ✅ Generación de tokens JWT al registrarse y hacer login
- ✅ Validación de campos obligatorios
- ✅ Mensajes de error genéricos por seguridad

**Métodos:**

#### `register(data)`
1. Valida que username, password y email estén presentes
2. Verifica que el username no exista
3. Hashea la contraseña con bcrypt
4. Crea el usuario en la BD
5. Genera un token JWT automáticamente
6. Retorna token + datos del usuario (sin contraseña)

#### `login(credentials)`
1. Busca el usuario por username
2. Compara la contraseña con bcrypt.compare()
3. Si es válida, genera un token JWT
4. Retorna token + datos del usuario

#### `refreshToken(oldToken)`
Renueva un token existente (útil para extender sesiones)

---

### 4. `src/auth/auth.controller.ts` (actualizado)
**Responsabilidad:** Manejar requests HTTP

**Endpoints:**
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token

---

### 5. `src/usuario/usuario.routes.ts` (actualizado)
**Responsabilidad:** Rutas protegidas de usuarios

**Antes:**
```typescript
router.get('/', controller.obtenerTodos);
```

**Ahora:**
```typescript
router.get('/', authenticateToken, requireAdmin, controller.obtenerTodos);
```

**Protección aplicada:**
| Ruta | Método | Permiso |
|------|--------|---------|
| GET /usuarios | Lista todos | Solo admin |
| GET /usuarios/:id | Ver uno | Admin o propietario |
| POST /usuarios | Crear | Solo admin |
| PATCH /usuarios/:id | Actualizar | Admin o propietario |
| DELETE /usuarios/:id | Eliminar | Solo admin |

---

## 🔐 ¿Cómo funciona el sistema?

### Flujo de registro:

```
1. Cliente → POST /api/auth/register
   Body: {username, password, email, nombre, ...}

2. auth.service.register()
   ├─ Valida campos obligatorios
   ├─ Verifica que username no exista
   ├─ Hashea contraseña: bcrypt.hash(password, 10)
   ├─ Guarda usuario con hash en BD
   └─ Genera JWT token

3. Respuesta ← {success: true, token: "eyJhbG...", user: {...}}

4. Cliente guarda el token (localStorage, cookies, etc.)
```

### Flujo de login:

```
1. Cliente → POST /api/auth/login
   Body: {username, password}

2. auth.service.login()
   ├─ Busca usuario por username
   ├─ Compara: bcrypt.compare(password, usuario.password_hash)
   ├─ Si coincide, genera JWT token
   └─ Retorna token

3. Respuesta ← {success: true, token: "eyJhbG...", user: {...}}
```

### Flujo de request protegido:

```
1. Cliente → GET /api/usuarios
   Header: Authorization: Bearer eyJhbGciOiJI...

2. Middleware authenticateToken
   ├─ Extrae token del header Authorization
   ├─ Verifica con jwt.verify(token, SECRET)
   ├─ Si es válido, agrega req.user = {id_usuario, username, rol}
   └─ Continúa al siguiente middleware

3. Middleware requireAdmin (si aplica)
   ├─ Verifica req.user.rol === 'administrador'
   ├─ Si NO es admin → 403 Forbidden
   └─ Si es admin → continúa

4. Controller → Procesa el request
   └─ Puede acceder a req.user con datos del usuario autenticado

5. Respuesta ← {success: true, data: [...]}
```

---

## 🔑 Variables de entorno

Se agregaron a `.env`:

```env
JWT_SECRET=tu_secreto_super_seguro_cambiame_en_produccion_123456
JWT_EXPIRES_IN=24h
```

**⚠️ IMPORTANTE:** Cambiar `JWT_SECRET` en producción por un valor aleatorio largo.

**Generar un secret seguro:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🧪 Cómo probar

### 1. Ejecutar el servidor:
```powershell
pnpm start:dev
```

### 2. Abrir `src/auth/auth-tests.http`

### 3. Ejecutar "REGISTER":
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "dni": "12345678",
  "username": "testuser",
  "password": "password123",
  "nombre": "Test",
  "apellido": "User",
  "email": "test@example.com",
  "telefono": "3412345678",
  "rol": "cliente",
  "id_localidad": 1
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjo...",
  "user": {
    "id_usuario": 5,
    "username": "testuser",
    "nombre": "Test",
    "apellido": "User",
    "email": "test@example.com",
    "rol": "cliente"
  }
}
```

### 4. Ejecutar "LOGIN":
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Respuesta esperada:** (igual al register)

### 5. Copiar el token y probar ruta protegida:

Abrir `src/usuario/usuario-protected.http` y pegar el token:

```http
GET http://localhost:3000/api/usuarios/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Debe funcionar** si el ID coincide con tu usuario.

### 6. Probar sin token (debe fallar):
```http
GET http://localhost:3000/api/usuarios/1
```

**Respuesta esperada (401):**
```json
{
  "success": false,
  "message": "Token de autenticación requerido"
}
```

---

## 📊 Resumen de cambios

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `src/auth/jwt.service.ts` | ✅ CREADO | Servicio de JWT |
| `src/auth/auth.middleware.ts` | ✅ CREADO | Middlewares de autenticación |
| `src/auth/auth.service.ts` | 🔄 ACTUALIZADO | Agregado bcrypt + JWT |
| `src/auth/auth.controller.ts` | 🔄 ACTUALIZADO | Nuevas respuestas con token |
| `src/auth/auth.routes.ts` | 🔄 RECREADO | Rutas de autenticación |
| `src/usuario/usuario.routes.ts` | 🔄 ACTUALIZADO | Rutas protegidas |
| `.env` | ➕ AGREGADO | Variables JWT |
| `.env.example` | ➕ AGREGADO | Plantilla |
| `src/auth/auth-tests.http` | ✅ CREADO | Tests de autenticación |
| `src/usuario/usuario-protected.http` | ✅ CREADO | Tests de rutas protegidas |

---

## 🔒 Seguridad implementada

### ✅ Contraseñas hasheadas con bcrypt
```typescript
// ANTES (INSEGURO):
password: data.password // "password123" en texto plano

// AHORA (SEGURO):
password: await bcrypt.hash(data.password, 10) // "$2b$10$X5..."
```

### ✅ Tokens JWT firmados
```typescript
// Token contiene:
{
  id_usuario: 5,
  username: "testuser",
  rol: "cliente",
  iat: 1735516800,  // Issued At
  exp: 1735603200   // Expiration (24h después)
}
// Firmado con secret → imposible de falsificar
```

### ✅ Validación de permisos
```typescript
// Cliente intentando acceder a ruta de admin:
GET /api/usuarios
Authorization: Bearer <token_cliente>

// → Middleware detecta que rol !== 'administrador'
// → Retorna 403 Forbidden
```

### ✅ Mensajes de error genéricos
```typescript
// NO decimos "Usuario no existe" o "Contraseña incorrecta"
// Solo: "Credenciales inválidas"
// Esto previene ataques de enumeración de usuarios
```

---

## 🎯 Lo que ahora cumple el TP

- ✅ **Login con autenticación** (JWT)
- ✅ **Hash de contraseñas** (bcrypt)
- ✅ **2 niveles de acceso** (admin/cliente)
- ✅ **Rutas protegidas** (middlewares)
- ✅ **Tokens seguros** (firmados y con expiración)

---

## 🚀 Próximos pasos sugeridos

1. **Tests automatizados** (OBLIGATORIO para aprobar)
   - Tests de auth.service
   - Tests de middlewares
   - Tests de integración

2. **Validación con Zod**
   - Validar schemas de register/login
   - Validar datos de entrada en todos los endpoints

3. **Refresh tokens**
   - Implementar tokens de larga duración
   - Refresh automático antes de expirar

4. **Rate limiting**
   - Prevenir fuerza bruta en /login
   - Limitar intentos fallidos

---

¿Alguna duda sobre la implementación? 🤔
