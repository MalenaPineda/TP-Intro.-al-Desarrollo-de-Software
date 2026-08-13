# TP-Intro.-al-Desarrollo-de-Software

## Visión General

Este proyecto es una aplicación de gestión de convivencia desarrollada como parte del curso de Introducción al Desarrollo de Software. Combina un backend de Node.js con PostgreSQL y una interfaz de usuario simple para demostrar conceptos fundamentales de desarrollo backend y API.

## Características Principales

- **Backend**: Servidor Express.js con endpoints RESTful
- **Base de Datos**: PostgreSQL con esquemas definidos
- **Docker**: Configuración contenedorizada para desarrollo y despliegue
- **API**: API modular y escalable para gestión de tareas y usuarios
- **Frontend**: Interfaz de usuario moderna y responsiva

## Requisitos del Sistema

### Requisitos de Desarrollo Local

- Node.js 20+
- PostgreSQL 15+
- Docker (opcional, recomendado)

### Dependencias del Proyecto

- `express` - Framework web para Node.js
- `pg` - Cliente PostgreSQL para Node.js
- `bcrypt` - Hashing de contraseñas
- `jsonwebtoken` - Gestión de tokens JWT

## Estructura del Proyecto

```
TP-Intro.-al-Desarrollo-de-Software/
├── app/
│   ├── app.js                    # Servidor principal
│   ├── .env                      # Variables de entorno
│   ├── package.json             # Dependencias del proyecto
│   ├── src/
│   │   ├── backend/
│   │   │   ├── api/             # Controladores de API
│   │   │   │   ├── auth.js      # Rutas de autenticación
│   │   │   │   ├── tasks.js     # Rutas de tareas
│   │   │   │   └── users.js     # Rutas de usuarios
│   │   │   ├── db/              # Configuración de base de datos
│   │   │   │   ├── connection.js    # Pool de conexiones
│   │   │   │   └── schemas.sql     # Migraciones de DB
│   │   │   └── middleware/      # Middleware de API
│   │   └── vista/                # Interfaz de usuario
│   │       ├── index.html       # Página principal
│   │       ├── tareas.html      # Página de tareas
│   │       └── tareas.js        # Lógica del lado del cliente
│   └── data/                     # Datos persistentes de DB
├── docker-compose.yml           # Configuración de Docker
└── Dockerfile                   # Imagen del contenedor
```

## Guía de Instalación

### Opción 1: Uso de Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/MalenaPineda/TP-Intro.-al-Desarrollo-de-Software.git
   cd TP-Intro.-al-Desarrollo-de-Software
   ```

2. **Construir y ejecutar los contenedores**
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación**
   - Backend: `http://localhost:8000/health`
   - Base de Datos: `http://localhost:5433`
   - Frontend: `http://localhost:8000/`

### Opción 2: Desarrollo Local

1. **Configurar la base de datos**
   ```bash
   # Crear base de datos PostgreSQL
   createdb tp_intro_desarrollo_software
   
   # Ejecutar esquemas SQL
   psql -d tp_intro_desarrollo_software -f app/src/backend/db/schemas.sql
   ```

2. **Instalar dependencias**
   ```bash
   cd app
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales de base de datos
   ```

4. **Ejecutar el servidor**
   ```bash
   node src/backend/app.js
   ```

## API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/logout` | Cerrar sesión |
| `GET`  | `/api/auth/me` | Obtener usuario actual |

### Tareas (`/api/tasks`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`  | `/api/tasks` | Listar todas las tareas |
| `GET`  | `/api/tasks/:id` | Obtener tarea por ID |
| `POST` | `/api/tasks` | Crear nueva tarea |
| `PUT`  | `/api/tasks/:id` | Actualizar tarea |
| `DELETE` | `/api/tasks/:id` | Eliminar tarea |
| `GET`  | `/api/tasks/user/:userId` | Listar tareas de usuario |

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`  | `/api/users` | Listar todos los usuarios |
| `GET`  | `/api/users/:id` | Obtener usuario por ID |
| `PUT`  | `/api/users/:id` | Actualizar usuario |
| `DELETE` | `/api/users/:id` | Eliminar usuario |

### Utilidad

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`  | `/health` | Verificar estado del servidor |

## Arquitectura de la API

### Middleware

- **Autenticación**: Validar tokens JWT en requests protegidas
- **Validación**: Validar cuerpo de requests con Zod
- **Rate Limiting**: Limitar requests por IP
- **Error Handling**: Manejo consistente de errores

### Controladores

- **AuthController**: Gestionar operaciones de autenticación
- **TaskController**: Gestionar operaciones CRUD de tareas
- **UserController**: Gestionar operaciones CRUD de usuarios

### Modelos y Base de Datos

- **User Model**: Información del usuario
- **Task Model**: Tareas con relaciones de usuario
- **Database Models**: Arquitectura de base de datos normalizada

## Características de Seguridad

1. **Autenticación JWT**
   - Tokens firmados con JWT
   - Refresh tokens para renovación segura
   - Invalidación de tokens en logout

2. **Protección de Rutas**
   - Middleware de autenticación en rutas protegidas
   - Autorización basada en roles
   - Política de acceso basada en roles

3. **Protección de Entradas**
   - Validación de inputs con express-validator
   - Sanitización de entradas para prevenir XSS
   - Límites de tamaño de payload

4. **Seguridad en la Base de Datos**
   - Consultas parametrizadas para prevenir inyección SQL
   - Políticas de acceso a roles de base de datos
   - Controles de auditoría de base de datos

## Desplegar la Aplicación

### Configuración del Proyecto para Producción

1. **Configurar variables de entorno**
   ```bash
   # .env
   NODE_ENV=production
   PORT=8000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/dbname
   JWT_SECRET=tu_secreto_jwt_muy_seguro
   JWT_EXPIRES_IN=24h
   BCRYPT_ROUNDS=12
   ```

2. **Construir imagen Docker**
   ```bash
   docker build -t tp-intro-desarrollo-software .
   ```

3. **Ejecutar contenedor**
   ```bash
   docker run -d --name tp-intro-app -p 8000:8000 tp-intro-desarrollo-software
   ```

### Despliegue con Docker Compose

```yaml
services:
  app:
    image: tp-intro-desarrollo-software
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: tp_intro_desarrollo_software
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Desarollo y Contribuciones

### Flujo de Trabajo de Git

1. **Crear una nueva rama para tus cambios**
   ```bash
   git checkout -b feature/nombre-de-caracteristica
   ```

2. **Hacer commits con mensajes descriptivos**
   ```bash
   git add .
   git commit -m "feature: agregar endpoint para crear tareas"
   ```

3. **Hacer pull request después de pruebas completas**
   ```bash
   git push origin feature/nombre-de-caracteristica
   ```

### Prácticas de Desarrollo

- **Convenciones de Nomenclatura**:
  - Archivos: kebab-case (ej: auth-controller.js)
  - Variables: camelCase
  - Constantes: UPPER_SNAKE_CASE

- **Reglas de Confirmación**:
  - Siempre tener pruebas unitarias para controladores y servicios
  - Ejecutar linting antes de confirmar
  - Incluir documentación para nuevos endpoints

### Scripts de Pruebas

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "lint": "eslint src/",
  "lint:fix": "eslint src/ --fix"
}
```

### Comandos de Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con reporte de cobertura
npm run test:coverage

# Ejecutar linting
npm run lint

# Corregir linting automáticamente
npm run lint:fix
```

## Documentación de APIs

### Documentación de Endpoints

Cada endpoint está documentado con OpenAPI/Swagger. Puedes acceder a la documentación en:

```
http://localhost:8000/api-docs
```

### Ejemplo de Request/Response

#### Login

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Response:**
```json
{
  "token": "jwt_token_aqui",
  "refreshToken": "refresh_token_aqui",
  "user": {
    "id": "user_id_aqui",
    "email": "user@example.com",
    "name": "Nombre del Usuario"
  }
}
```

#### Crear Tarea

**Request:**
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer jwt_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{"title": "Nueva Tarea", "description": "Descripción de la tarea"}'
```

**Response:**
```json
{
  "id": "task_id_aqui",
  "title": "Nueva Tarea",
  "description": "Descripción de la tarea",
  "status": "pending",
  "userId": "user_id_aqui",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Modelo de Datos

### Usuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del usuario |
| `email` | String | Email único |
| `password` | String | Hash de contraseña |
| `name` | String | Nombre completo |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Fecha de última actualización |

### Tareas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único de la tarea |
| `title` | String | Título de la tarea |
| `description` | String | Descripción de la tarea |
| `status` | Enum | Estado (pending, in_progress, completed) |
| `userId` | UUID | ID del usuario asignado |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Fecha de última actualización |

## Troubleshooting

### Errores Comunes

1. **Error de Conexión a la Base de Datos**
   ```bash
   # Verificar si PostgreSQL está corriendo
   psql -h localhost -U postgres -c "SELECT 1"
   
   # Asegurar que el usuario y base de datos existen
   createdb tp_intro_desarrollo_software
   psql -d tp_intro_desarrollo_software -f app/src/backend/db/schemas.sql
   ```

2. **Error en la Configuración de JWT**
   ```bash
   # Verificar JWT_SECRET en .env
   echo "JWT_SECRET=$(cat .env | grep JWT_SECRET | cut -d'=' -f2)"
   ```

3. **Error de Puerto en Uso**
   ```bash
   # Verificar si el puerto 8000 está en uso
   netstat -tulpn | grep :8000
   
   # Cambiar puerto en app.js si es necesario
   ```

4. **Fallo en la Instalación de npm**
   ```bash
   # Limpiar node_modules y package-lock.json
   rm -rf node_modules package-lock.json
   npm install
   ```

### Recursos de Ayuda

- [Documentación de Express.js](https://expressjs.com/en/starter/installing.html)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de Docker](https://docs.docker.com/get-started/)
- [Guía de JWT](https://auth0.com/docs/secure/tokens/json-web-tokens)
- [Documentación de Zod](https://zod.dev/)

## Changelog

### [1.0.0] - 2024-XX-XX

- Versiones iniciales del backend y frontend
- Configuración base de Docker
- Documentación de la API
- Implementación del endpoint de salud

### Próximas Versiones

- Implementar gestión completa de autenticación
- Agregar endpoints CRUD completos para tareas y usuarios
- Implementar middleware de autenticación y autorización
- Agregar filtros avanzados y paginación para APIs
- Implementar pruebas unitarias y de integración
- Configurar CI/CD pipeline
- Agregar documentación de Swagger/OpenAPI

## Contribuir

Este proyecto es una contribución al curso de Introducción al Desarrollo de Software. Las contribuciones son bienvenidas para mejorar el código, agregar nuevas características y corregir errores.

### Cómo Contribuir

1. **Fork este repositorio**
2. **Crear una rama para tus cambios**
   ```bash
   git checkout -b feature/nombre-de-caracteristica
   ```
3. **Hacer commits con mensajes descriptivos**
4. **Hacer pull request**

### Patrocinadores

- Malena Pineda - Profesora del curso
- Todos los estudiantes que contribuyeron a este proyecto

## Licencia

Copyright (c) 2024 TP-Intro.-al-Desarrollo-de-Software
Licencia ISC (ISC License)

Permiso es concedido, gratuitamente, a cualquier persona obteniendo una copia
 de este software y archivos de documentación (el "Software"), para utilizar
 el Software sin restricciones, incluyendo sin limitación los derechos
 de utilizar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar
 y/o vender copias del Software, y de permitir a las personas a las que el
 Software es facilitado, hacerlo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este permiso deberán ser incluidos en todas
 las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "COMO ESTÁ", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O
IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A LAS GARANTÍAS DE COMERCIALIZACIÓN,
NO VIOLACIÓN Y DE IDONEIDAD PARA UN PROPÓSITO EN PARTICULAR. EN NINGÚN CASO LOS
AUTORES O TITULARES DE LOS DERECHOS DE AUTOR SERÁN RESPONSABILIZADOS POR NINGUNA
RECLAMACIÓN, DAÑO O LITIGIO OTRO.
