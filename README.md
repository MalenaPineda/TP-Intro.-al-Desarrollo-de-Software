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

Pagina de Bienvenida para ingresar a la plataforma CoLiving.
<img width="1366" height="768" alt="WhatsApp Image 2026-07-30 at 18 50 19" src="https://github.com/user-attachments/assets/4e5a59d6-98f0-4f5d-bc4f-22eb747f9b66" />

Pantalla principal: Muestra el resumen de tareas pendientes junto con el estado de cada tarea seleccionada por el usuario, los gastos acumulados del mes con la parte de cada usuario y el estado de progreso de las tareas. 

<img width="1366" height="768" alt="1" src="https://github.com/user-attachments/assets/94e7f3a8-e47a-4233-8647-8172f165a6c1" />

Resumen de las tareas asignadas/elegidas por el usuario con su estado y su vencimiento (si corresponde) y los gastos recientes.

<img width="1366" height="768" alt="2" src="https://github.com/user-attachments/assets/f309c2e8-9dd2-4209-bba9-d3e48c09edd0" />

Historial y Gráficos de Gastos.

<img width="1366" height="768" alt="3" src="https://github.com/user-attachments/assets/d67b673d-1162-48bc-beac-1958f40c5db6" />

Graficos visuales de gastos por mes y evolucion.

<img width="1366" height="768" alt="4" src="https://github.com/user-attachments/assets/4431801f-2e1d-4625-899a-b40255b06b5e" />

Tabla del resumen anual de gastos, con busqueda por categoria.

<img width="1366" height="768" alt="5" src="https://github.com/user-attachments/assets/d04dbc3f-6548-45e2-bc11-bed141cb0959" />

Registro de Gastos. Formulario integrado para añadir un nuevo gasto indicando nombre, categoría, monto y método de pago utilizado.

<img width="1366" height="768" alt="6" src="https://github.com/user-attachments/assets/4c77550d-e697-4711-a454-3f193e6eef57" />

Tablero de Tareas.Organización visual de las tareas del hogar divididas en: tareas disponibles para elegir, tareas seleccionadas (propias) y tareas asignadas a los demás miembros.

<img width="1366" height="768" alt="7" src="https://github.com/user-attachments/assets/8c4fc747-23dd-4ef1-906f-5b53cdb46111" />

Registro de Tareas. Sección integrada a la creación de nuevas tareas definiendo su nombre, categoría correspondiente, fecha de vencimiento.

<img width="1366" height="768" alt="8" src="https://github.com/user-attachments/assets/bbfc6f81-42e3-46a9-94a9-8fafb58e35d7" />

Ranking de Tareas. Muestra la tabla de clasificación que permite visualizar al miembro que más tareas ha realizado y las insignias ganadas, fomentando la participación mediante el sistema de insignias.

<img width="1366" height="768" alt="9" src="https://github.com/user-attachments/assets/dee098c3-e7f0-4438-9cd9-850b1d820708" />

Regristro para agregar una nueva insignia.

<img width="1366" height="768" alt="9" src="https://github.com/user-attachments/assets/bd4a2748-6b45-4b39-8b98-6575f58ad976" />

Formulario integrado para registrar un nuevo miembro a la casa.

<img width="1366" height="768" alt="11" src="https://github.com/user-attachments/assets/e0a6d1ed-fbf9-49ac-9b9c-92c80f57470e" />

