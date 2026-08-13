# CoLiving — Sistema de Gestión de Convivencia

**Trabajo Práctico — Introducción al Desarrollo de Software**

CoLiving es una aplicación web full-stack diseñada para facilitar la administración de gastos y tareas domésticas entre convivientes, incluyendo un sistema de ranking e insignias por participación.

### Integrantes:
* María Fernanda Toyo 
* Malena Aylen Pineda
* María Eugenia Brum
* Jesús David Guerra

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5, CSS3 (Bulma), JavaScript Vanilla (ES6+), Chart.js |
| **Backend** | Node.js (v22), Express.js (v5), ES Modules |
| **Base de Datos** | PostgreSQL 18 (`pg` client) |
| **Infraestructura** | Docker, Docker.frontend | Docker Compose, Makefile, `http-server` |

---

## Arquitectura del Sistema

```text
┌─────────────────────────────────────────────────────┐
│                     Frontend                        │
│              http-server :8080                       │
│         HTML + CSS + JavaScript vanilla              │
└──────────────────────┬──────────────────────────────┘
                       │ fetch() /api/v1/...
                       │ CORS localhost:8000
                       ▼
┌─────────────────────────────────────────────────────┐
│                   Backend API                        │
│               Express :8000                          │
│         /api/v1/gastos | /api/v1/tareas              │
└──────────────────────┬──────────────────────────────┘
                       │ pg.Pool
                       │ localhost:5432
                       ▼
┌─────────────────────────────────────────────────────┐
│                 PostgreSQL 18                        │
│                    9 tablas                          │
│              schemas.sql + seeds.sql                  │
└─────────────────────────────────────────────────────┘
```

---

## Ejecución Local

### Opción 1: Con Docker y Makefile 

```bash
# 1. Clonar el repositorio
git clone [https://github.com/MalenaPineda/TP-Intro.-al-Desarrollo-de-Software.git](https://github.com/MalenaPineda/TP-Intro.-al-Desarrollo-de-Software.git)
cd TP-Intro.-al-Desarrollo-de-Software

# 2. Configurar variables de entorno
# Copiar el archivo de ejemplo y renombrarlo a .env
cp .env.example .env

# 3. Levantar la aplicación completa
make run
```

> **Comandos útiles del Makefile:**
> Para levantar solo el frontend: make run-front
Para levantar el backend (junto con la base de datos): make run-back
Para levantar toda la aplicación: make run

### Opción 2: Ejecución Manual

```bash
# 1. Levantar/Configurar PostgreSQL local e instalar dependencias
cd app
npm install

# 2. Configurar variables de entorno en app/.env
# DB_USER=usuario
# DB_PASS=password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=db_postgres

# 3. Iniciar Backend
npm run dev

# 4. En otra terminal, servir Frontend
cd src/frontend && npx http-server -p 8080
```

### Accesos Principales

* **Frontend:** `http://localhost:8080`
* **API Backend:** `http://localhost:8000/api/v1`
* **Health Check:** `http://localhost:8000/health`

---

## API REST — Endpoints Principales

### Tareas (`/api/v1/tareas`)
* `GET /` | `GET /disponibles` | `GET /completas`: Listados de tareas y estados.
* `GET /mias/:id_user` | `GET /otros/:id_user`: Tareas filtradas por asignación.
* `GET /ranking`: Ranking de tareas completadas e insignias.
* `POST /`: Crear tarea.
* `PUT /:id` | `PATCH /:id`: Editar datos o actualizar estado.
* `POST /:id/usuarios`: Asignar tarea a un usuario.
* `DELETE /:id`: Eliminar tarea.

### Gastos (`/api/v1/gastos`)
* `GET /`: Listar todos los gastos.
* `GET /total-mes` | `GET /total-mes/usuario/:id`: Totales del mes.
* `GET /categoria` | `GET /por-mes`: Métricas y agrupaciones para gráficos.
* `POST /`: Registrar nuevo gasto.
* `PUT /:id` | `DELETE /:id`: Actualizar o eliminar gasto.

---

## Estructura del Proyecto

```text
.
├── Dockerfile                        # Imagen del backend Node.js
├── Dockerfile.frontend               # Ejecuta el Frontend dentro de un contenedor Docker (utilizando http-server)
├── docker-compose.yml                # Orquestación de contenedores
├── Makefile                          # Comandos simplificados de ejecución
├── app/
│   ├── .env                          # Variables de entorno
│   ├── app.js                        # Punto de entrada Express
│   ├── db/
│   │   ├── pool.js                   # Conexión a PostgreSQL
│   │   ├── schemas.sql / seeds.sql   # DDL y datos iniciales
│   │   └── migrar_db_render.js       # Script de despliegue remoto
│   └── src/
│       ├── backend/api/              # Controladores / Rutas Express
│       └── frontend/                 # Vistas HTML, estilos y JS Vanilla
└── data/                             # Volumen persistente de PostgreSQL
```

---

## Notas Técnicas y Buenas Prácticas

* **Seguridad:** Consultas SQL parametrizadas (`$1`, `$2`) para prevenir inyecciones SQL.
* **Módulos:** Arquitectura basada en ES Modules nativos (`"type": "module"`).
* **CORS:** Restringido explícitamente a peticiones desde el origen del frontend (`localhost:8080`).
* **Persistencia:** Configuración de volumen Docker mapeado a `./data` para mantener la base de datos entre reinicios.
* **Despliegue Remoto:** Incluye script en `app/db/migrar_db_render.js` para inicialización de esquemas en servicios Cloud (Render).

 ## Vistas de la Aplicación

A continuación se presentan capturas de pantalla con las funcionalidades principales del sistema:
Pantalla de Inicio

Pagina de Bienvenida para ingresar a la plataforma CoLiving.

Panel Principal (Dashboard)
<img width="1366" height="768" alt="WhatsApp Image 2026-07-30 at 18 50 19" src="https://github.com/user-attachments/assets/4e5a59d6-98f0-4f5d-bc4f-22eb747f9b66" />

Vista general con el resumen de tareas pendientes, los gastos acumulados del mes, el cálculo de tu parte a pagar y el estado de progreso de tus tareas.
Historial y Gráficos de Gastos

<img width="1366" height="768" alt="2 jpg" src="https://github.com/user-attachments/assets/5827ea89-2fbb-4465-a43f-0e5618ae2263" />


Visualización de los gastos compartidos de la casa, incluyendo gráficos de barras para los gastos mensuales y división por categorías.
<img width="1366" height="768" alt="4 jpg" src="https://github.com/user-attachments/assets/a223fc16-b912-4373-997e-aabaaea3df5f" />

Registro de Gastos

Formulario integrado para añadir un nuevo gasto indicando nombre, categoría, monto y método de pago utilizado.
Tablero de Tareas
<img width="1366" height="768" alt="3 jpg" src="https://github.com/user-attachments/assets/0ae49cd1-9661-4e74-9be2-ed153e691f66" />

Organización visual de las tareas del hogar divididas en: tareas disponibles para elegir, tareas seleccionadas (propias) y tareas asignadas a los demás miembros.
Gestión y Creación de Tareas
<img width="1366" height="768" alt="imagen" src="https://github.com/user-attachments/assets/6c95f99f-ae4d-45a1-82e5-29c99135667c" />

Sección dedicada a la creación de nuevas tareas definiendo su nombre, categoría correspondiente, fecha de vencimiento y observaciones.
Ranking de Usuarios
<img width="1366" height="768" alt="imagen" src="https://github.com/user-attachments/assets/4ace703f-700c-47ec-a4a3-154fa382c70c" />


Tabla de clasificación que muestra al miembro que más tareas ha realizado, fomentando la participación mediante el sistema de insignias.
<img width="1366" height="768" alt="imagen" src="https://github.com/user-attachments/assets/f18c2bf7-2c4e-41d6-98fa-5ef01e908571" />
