import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: ' Sistema de Reserva de Canchas - API',
      version: '1.0.0',
      description: 'API REST para gestión de reservas de canchas deportivas',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Autenticación y login' },
      { name: 'Usuarios', description: 'Gestión de usuarios' },
      { name: 'Canchas', description: 'Gestión de canchas' },
      { name: 'Tipo Cancha', description: 'Tipos de cancha' },
      { name: 'Localidades', description: 'Localidades' },
      { name: 'Reservas', description: 'Gestión de reservas' },
      { name: 'Precios', description: 'Precios de canchas' },
      { name: 'Servicios', description: 'Servicios adicionales' },
      { name: 'Pagos', description: 'Gestión de pagos' },
      { name: 'Disponibilidad', description: 'Disponibilidad de canchas' },
      { name: 'Búsqueda', description: 'Búsqueda de canchas' },
    ],
    paths: {
      // ─── AUTH ─────────────────────────────────────────────────────────────
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Iniciar sesión',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: { type: 'string', example: 'admin' },
                    password: { type: 'string', example: 'admin123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login exitoso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      token: { type: 'string', example: 'eyJhbGci...' },
                      message: { type: 'string', example: 'Login exitoso' },
                    },
                  },
                },
              },
            },
            401: { description: 'Credenciales incorrectas' },
          },
        },
      },

      // ─── USUARIOS ─────────────────────────────────────────────────────────
      '/api/usuarios': {
        get: {
          tags: ['Usuarios'],
          summary: 'Obtener todos los usuarios',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de usuarios' },
            401: { description: 'No autenticado' },
          },
        },
        post: {
          tags: ['Usuarios'],
          summary: 'Crear un usuario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password', 'rol'],
                  properties: {
                    username: { type: 'string', example: 'nuevo_usuario' },
                    password: { type: 'string', example: 'password123' },
                    rol: { type: 'string', enum: ['cliente', 'administrador'], example: 'cliente' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuario creado' },
            400: { description: 'Datos inválidos' },
          },
        },
      },
      '/api/usuarios/{id}': {
        get: {
          tags: ['Usuarios'],
          summary: 'Obtener usuario por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Usuario encontrado' },
            404: { description: 'Usuario no encontrado' },
          },
        },
        put: {
          tags: ['Usuarios'],
          summary: 'Actualizar usuario',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Usuario actualizado' },
            404: { description: 'Usuario no encontrado' },
          },
        },
        delete: {
          tags: ['Usuarios'],
          summary: 'Eliminar usuario',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Usuario eliminado' },
            404: { description: 'Usuario no encontrado' },
          },
        },
      },

      // ─── CANCHAS ──────────────────────────────────────────────────────────
      '/api/canchas': {
        get: {
          tags: ['Canchas'],
          summary: 'Obtener todas las canchas',
          responses: { 200: { description: 'Lista de canchas' } },
        },
        post: {
          tags: ['Canchas'],
          summary: 'Crear una cancha',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nombre', 'direccion', 'id_localidad', 'id_tipo_cancha'],
                  properties: {
                    nombre: { type: 'string', example: 'Cancha A' },
                    direccion: { type: 'string', example: 'Av. Ejemplo 123' },
                    id_localidad: { type: 'integer', example: 1 },
                    id_tipo_cancha: { type: 'integer', example: 2 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Cancha creada' },
            400: { description: 'Datos inválidos' },
          },
        },
      },
      '/api/canchas/{id}': {
        get: {
          tags: ['Canchas'],
          summary: 'Obtener cancha por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Cancha encontrada' },
            404: { description: 'Cancha no encontrada' },
          },
        },
        put: {
          tags: ['Canchas'],
          summary: 'Actualizar cancha',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Cancha actualizada' } },
        },
        delete: {
          tags: ['Canchas'],
          summary: 'Eliminar cancha',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Cancha eliminada' } },
        },
      },

      // ─── RESERVAS ─────────────────────────────────────────────────────────
      '/api/reservas': {
        get: {
          tags: ['Reservas'],
          summary: 'Obtener todas las reservas',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de reservas' } },
        },
        post: {
          tags: ['Reservas'],
          summary: 'Crear una reserva',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id_cancha', 'fecha', 'hora_inicio', 'hora_fin'],
                  properties: {
                    id_cancha: { type: 'integer', example: 1 },
                    fecha: { type: 'string', format: 'date', example: '2024-03-15' },
                    hora_inicio: { type: 'string', example: '18:00' },
                    hora_fin: { type: 'string', example: '20:00' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Reserva creada' },
            400: { description: 'Datos inválidos o cancha no disponible' },
          },
        },
      },
      '/api/reservas/{id}': {
        get: {
          tags: ['Reservas'],
          summary: 'Obtener reserva por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Reserva encontrada' }, 404: { description: 'Reserva no encontrada' } },
        },
        delete: {
          tags: ['Reservas'],
          summary: 'Cancelar reserva',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Reserva cancelada' } },
        },
      },

      // ─── LOCALIDADES ──────────────────────────────────────────────────────
      '/api/localidades': {
        get: {
          tags: ['Localidades'],
          summary: 'Obtener todas las localidades',
          responses: { 200: { description: 'Lista de localidades' } },
        },
        post: {
          tags: ['Localidades'],
          summary: 'Crear una localidad',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Rosario' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Localidad creada' } },
        },
      },

      // ─── TIPO CANCHA ──────────────────────────────────────────────────────
      '/api/tipo-canchas': {
        get: {
          tags: ['Tipo Cancha'],
          summary: 'Obtener todos los tipos de cancha',
          responses: { 200: { description: 'Lista de tipos de cancha' } },
        },
        post: {
          tags: ['Tipo Cancha'],
          summary: 'Crear tipo de cancha',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Fútbol 5' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Tipo de cancha creado' } },
        },
      },

      // ─── PRECIOS ──────────────────────────────────────────────────────────
      '/api/precios': {
        get: {
          tags: ['Precios'],
          summary: 'Obtener todos los precios',
          responses: { 200: { description: 'Lista de precios' } },
        },
        post: {
          tags: ['Precios'],
          summary: 'Crear precio',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Precio creado' } },
        },
      },

      // ─── SERVICIOS ────────────────────────────────────────────────────────
      '/api/servicios': {
        get: {
          tags: ['Servicios'],
          summary: 'Obtener todos los servicios',
          responses: { 200: { description: 'Lista de servicios' } },
        },
        post: {
          tags: ['Servicios'],
          summary: 'Crear servicio',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Servicio creado' } },
        },
      },

      // ─── PAGOS ────────────────────────────────────────────────────────────
      '/api/pagos': {
        get: {
          tags: ['Pagos'],
          summary: 'Obtener todos los pagos',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de pagos' } },
        },
        post: {
          tags: ['Pagos'],
          summary: 'Registrar un pago',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Pago registrado' } },
        },
      },

      // ─── DISPONIBILIDAD ───────────────────────────────────────────────────
      '/api/disponibilidad': {
        get: {
          tags: ['Disponibilidad'],
          summary: 'Consultar disponibilidad de una cancha',
          parameters: [
            { name: 'id_cancha', in: 'query', required: true, schema: { type: 'integer' } },
            { name: 'fecha', in: 'query', required: true, schema: { type: 'string', format: 'date' } },
          ],
          responses: { 200: { description: 'Disponibilidad de la cancha' } },
        },
      },

      // ─── BÚSQUEDA ─────────────────────────────────────────────────────────
      '/api/buscar-canchas': {
        get: {
          tags: ['Búsqueda'],
          summary: 'Buscar canchas disponibles',
          parameters: [
            { name: 'localidad', in: 'query', schema: { type: 'integer' } },
            { name: 'tipo_cancha', in: 'query', schema: { type: 'integer' } },
            { name: 'fecha', in: 'query', schema: { type: 'string', format: 'date' } },
          ],
          responses: { 200: { description: 'Lista de canchas disponibles' } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
export { swaggerSpec };