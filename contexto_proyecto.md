# CoLiving — Contexto Completo del Proyecto

> Archivo de referencia para IA y desarrolladores. Contiene todo lo necesario para trabajar en el proyecto sin errores.

---

## 1. Visión General

App de gestión de convivencia para roomies. Permite gestionar tareas del hogar, gastos compartidos y gamificación con insignias. Es el trabajo práctico final de la materia "Introducción al Desarrollo de Software".

**Equipo:**
- Jesús → `feature/tareas-jesus` (tareas, backend, frontend)
- Eugenia/compañera → gastos, ver_gastos, ingresar_gastos
- Maru/Malena → coordinación, DB, otras funciones

---

## 2. Stack

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express 5 |
| Módulos | ES Modules (`import/export`, nunca `require`) |
| Base de datos | PostgreSQL 18 |
| Contenedores | Docker + Docker Compose |
| Frontend | HTML/CSS/JS vanilla |
| CSS framework | Bulma 1.0 |
| Íconos | Font Awesome 6.5 |
| Dev server | nodemon (backend), http-server (frontend) |

---

## 3. Estructura de Carpetas

```
TP-Intro.-al-Desarrollo-de-Software/
├── Dockerfile
├── Makefile
├── docker-compose.yml
├── contexto_proyecto.md          ← ESTE ARCHIVO
├── proyect_context.md            ← versión anterior (desactualizada)
├── app/
│   ├── app.js                    ← entrada del servidor (Express, puerto 8000)
│   ├── package.json              ← type: "module" (ES Modules)
│   ├── .env                      ← variables de entorno de la DB
│   ├── db/
│   │   ├── pool.js               ← conexión PostgreSQL (Pool de pg)
│   │   ├── schemas.sql           ← DDL: CREATE TABLE de todas las tablas
│   │   ├── seeds.sql             ← datos de prueba (el que usa Docker)
│   │   ├── seed.sql              ← versión anterior (ignorar)
│   │   ├── tareas.js             ← queries SQL de tareas
│   │   └── gastos.js             ← queries SQL de gastos
│   └── src/
│       ├── backend/api/
│       │   ├── tareas.js         ← Router de Express: endpoints de tareas
│       │   └── gastos.js         ← Router de Express: endpoints de gastos
│       └── frontend/
│           ├── index.html        ← placeholder Hello World
│           ├── dashboard.html    ← página principal (estática por ahora)
│           ├── tareas.html       ← tablero kanban de tareas (3 columnas)
│           ├── gestion_tareas.html ← CRUD de tareas (form + tabla)
│           ├── ver_gastos.html   ← ver gastos + gráfico donut
│           ├── ingresar_gastos.html ← formulario de gastos
│           ├── css/
│           │   └── style.css     ← estilos compartidos (variables, layout, sidebar, componentes)
│           └── js/
│               ├── tareas.js         ← lógica de tareas.html
│               ├── gestion_tareas.js ← lógica de gestion_tareas.html
│               ├── dashboard.js      ← lógica de dashboard.html (vacío)
│               ├── ver_gastos.js     ← lógica de ver_gastos.html
│               ├── ingresar_gastos.js← lógica de ingresar_gastos.html
│               └── login.js         ← stub (1 línea)
```

---

## 4. Docker

### docker-compose.yml
- **convivencia-api**: Node.js en puerto 8000, monta `./app:/app` con volúmenes
- **db**: PostgreSQL 18 en puerto 5433 (externo) → 5432 (interno), monta `./data:/var/lib/postgresql`
- **Init DB**: Docker ejecuta automáticamente `schemas.sql` y `seeds.sql` al levantar

### .env
```
DB_USER=postgres
DB_PASS=postgres
DB_HOST=db            ← nombre del servicio en docker-compose, NO "localhost"
DB_PORT=5432
DB_NAME=postgres
```

### Comandos
```bash
# Levantar todo
docker compose up --build

# Resetear BD (cuando cambia schema o seed)
docker compose down && sudo rm -rf ./data && docker compose up --build

# Correr frontend (desde app/src/frontend)
npx http-server -p 8080

# Con Makefile
make run              # levanta backend + frontend
make run-back         # solo backend
make run-front        # solo frontend

# Ver logs del servidor
docker compose logs -f convivencia-api

# Conectarse a la BD
docker compose exec db psql -U postgres -d postgres
```

### CORS
```javascript
// app.js — permite peticiones desde el frontend
cors({
  origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
})
```

---

## 5. Base de Datos

### Schema (schemas.sql)

```sql
CREATE TABLE usuarios (
    id_user SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE categoria_tareas (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE categoria_gastos (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE metodo_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE gastos (
    id_gasto SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_gasto DATE DEFAULT CURRENT_DATE,
    id_metodo INT NOT NULL,
    categoria INT NOT NULL,
    id_user INT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categoria_gastos(id_categoria),
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user),
    FOREIGN KEY (id_metodo) REFERENCES metodo_pago(id)
);

CREATE TABLE tareas (
    id_tarea SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    fecha_vencimiento DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diaria BOOLEAN DEFAULT FALSE,
    estado VARCHAR(30) DEFAULT 'pendiente',
    notas VARCHAR(255),
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria_tareas(id_categoria)
);

CREATE TABLE insignias (
    id_insignia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    cant_tarea INT NOT NULL,
    id_categoria_tarea INT,
    icono VARCHAR(255),
    FOREIGN KEY (id_categoria_tarea) REFERENCES categoria_tareas(id_categoria)
);

CREATE TABLE user_insignia (
    id_user INT NOT NULL,
    id_insignia INT NOT NULL,
    disponible BOOLEAN DEFAULT FALSE,
    fecha_obtenida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_insignia),
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user),
    FOREIGN KEY (id_insignia) REFERENCES insignias(id_insignia)
);

CREATE TABLE tarea_user (
    id_tarea INT NOT NULL,
    id_user INT NOT NULL,
    PRIMARY KEY (id_tarea, id_user),
    FOREIGN KEY (id_tarea) REFERENCES tareas(id_tarea),
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user)
);
```

### Estados válidos de tareas
`'pendiente'`, `'en progreso'`, `'hecha'`

### Seed (seeds.sql)

**Usuarios (id_user):**
| id | nombre | email |
|---|---|---|
| 1 | Juan Pérez | juan.perez@gmail.com |
| 2 | Ana Gómez | ana.gomez@gmail.com |
| 3 | Jesús | jesus@hogar.com |
| 4 | María | maria@hogar.com |
| 5 | Pedro | pedro@hogar.com |

**Categorías de tareas (id_categoria):**
| id | nombre |
|---|---|
| 1 | Limpieza |
| 2 | Cocina |
| 3 | Mantenimiento |
| 4 | Jardinería |
| 5 | Mascotas |
| 6 | Compras |

**Categorías de gastos (id_categoria):**
| id | nombre |
|---|---|
| 1 | Alquiler y Expensas |
| 2 | Supermercado |
| 3 | Servicios |
| 4 | Delivery y Salidas |
| 5 | Artículos de Limpieza |
| 6 | Transporte |
| 7 | Ocio |

**Métodos de pago (id):**
| id | nombre |
|---|---|
| 1 | Efectivo |
| 2 | Tarjeta de crédito |
| 3 | Transferencia |
| 4 | Tarjeta débito |
| 5 | Transferencia bancaria |

**Relaciones tarea-usuario (tarea_user):**
| id_tarea | id_user |
|---|---|
| 1 | 4 (María lava los platos) |
| 2 | 3 (Jesús saca la basura) |
| 3 | 5 (Pedro compra papel) |
| 4 | 3 (Jesús revisa la lámpara) |

---

## 6. Backend — Convenciones

### Arquitectura de capas
```
db/tareas.js        → hace queries SQL, retorna rows
api/tareas.js       → Router de Express, validaciones, llama a db/, responde JSON
app.js              → monta los routers en las rutas base
```

### Convenciones de código
- **ES Modules**: siempre `import/export`, nunca `require`
- **Parámetros SQL**: siempre `$1, $2...` con array de valores (nunca concatenar strings)
- **`RETURNING *`**: agregar al final de INSERT/UPDATE/DELETE para devolver la fila
- **async/await**: todas las funciones que hacen queries son `async`
- **try/catch**: siempre en los endpoints
- **HTTP status**: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Error
- **Orden de rutas**: las rutas específicas (`/disponibles`, `/completas`, etc.) van ANTES de `/:id`

### pool.js
```javascript
import { Pool } from "pg";
export const db = new Pool({
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "postgres",
  host: process.env.DB_HOST ?? "db",
  port: process.env.DB_PORT ?? 5432,
  database: process.env.DB_NAME ?? "postgres",
  options: "-c timezone=America/Argentina/Buenos_Aires"
});
```

---

## 7. Backend — Endpoints de Tareas

Base: `http://localhost:8000/api/v1/tareas`

| Método | Ruta | Descripción | Body / Params | Respuesta |
|---|---|---|---|---|
| `GET` | `/` | Todas las tareas | - | `[{ id_tarea, descripcion, fecha_vencimiento, estado, notas, id_categoria, diaria, fecha_creacion }]` |
| `GET` | `/completas` | Tareas con info completa (para gestión) | - | `[{ id_tarea, descripcion, id_categoria, categoria, estado, fecha_vencimiento, notas, diaria, fecha_creacion, usuario: ["nombre1", "nombre2"] }]` |
| `GET` | `/disponibles` | Tareas sin usuario asignado | - | `[{ id_tarea, descripcion, id_categoria, categoria, estado, fecha_vencimiento, notas, diaria, fecha_creacion }]` |
| `GET` | `/mias/:id_user` | Tareas asignadas al usuario | - | `[{ id_tarea, descripcion, id_categoria, categoria, estado, fecha_vencimiento, notas, diaria, fecha_creacion }]` |
| `GET` | `/otros/:id_user` | Tareas asignadas a otros usuarios | - | `[{ id_tarea, descripcion, id_categoria, categoria, estado, fecha_vencimiento, notas, diaria, fecha_creacion, usuario: "nombre" }]` |
| `GET` | `/nombre-categoria-tarea` | Categorías de tareas | - | `[{ id_categoria, nombre }]` |
| `GET` | `/ranking` | Ranking de tareas completadas | - | `[{ id_user, nombre, tareas_completadas }]` |
| `GET` | `/:id` | Tarea por ID | - | `{ id_tarea, descripcion, ... }` |
| `POST` | `/` | Crear tarea | `{ descripcion, fecha_vencimiento, id_categoria, notas }` | `{ id_tarea, descripcion, ... }` |
| `PUT` | `/:id` | Editar tarea | `{ descripcion, fecha_vencimiento, id_categoria, notas }` | `{ id_tarea, descripcion, ... }` |
| `PATCH` | `/:id` | Cambiar estado | `{ estado: "pendiente" \| "en progreso" \| "hecha" }` | `{ id_tarea, estado, ... }` |
| `DELETE` | `/:id` | Eliminar tarea | - | `{ mensaje: "Tarea eliminada correctamente", tarea }` |
| `POST` | `/:id/usuarios` | Asignar usuario a tarea | `{ id_user }` | `{ id_tarea, id_user }` |

### Notas sobre `/completas`
- Usa `array_agg(usuarios.nombre)` para agrupar todos los usuarios asignados
- El campo `usuario` es un array: `["Jesús", "Pedro"]` o `[null]` si no tiene nadie
- Retorna `id_categoria` (número) y `categoria` (string con el nombre)

---

## 8. Backend — Endpoints de Gastos

Base: `http://localhost:8000/api/v1/gastos`

| Método | Ruta | Descripción | Body / Params | Respuesta |
|---|---|---|---|---|
| `GET` | `/` | Todos los gastos | - | `[{ id_gasto, descripcion, monto, fecha_gasto, categoria, id_user, nombre, metodo_pago }]` |
| `GET` | `/total-mes` | Total de gastos del mes actual | - | `{ total }` |
| `GET` | `/total-mes/usuario/:id` | Total de gastos del mes por usuario | - | `{ total }` |
| `GET` | `/categoria` | Gastos agrupados por categoría (mes actual) | - | `[{ nombre, total_monto }]` |
| `GET` | `/nombre-categoria` | Categorías de gastos | - | `[{ id_categoria, nombre }]` |
| `GET` | `/metodo-pago` | Métodos de pago | - | `[{ id, nombre }]` |
| `GET` | `/por-mes` | Gastos agrupados por mes | - | `[{ mes, anio, total }]` |
| `POST` | `/` | Crear gasto | `{ descripcion, monto, metodo_pago, categoria, id_user }` | `{ descripcion, monto, metodo_pago, categoria, id_user }` |
| `PUT` | `/:id` | Editar gasto | `{ descripcion, monto, metodo_pago, categoria }` | 200 OK |
| `DELETE` | `/:id` | Eliminar gasto | - | 200 OK |

---

## 9. Frontend — Convenciones

### Patrón general de archivos JS

```javascript
// 1. URL_API al inicio
const URL_API = 'http://localhost:8000/api/v1/tareas';

// 2. Constantes (colores por categoría, etc.)
const coloresPorCategoria = { 1: '#00bfa5', ... };

// 3. Función init() que carga todo
async function init() {
    await cargarDatos1();
    await cargarDatos2();
    registrarHandlerFormulario();
}

// 4. Funciones de carga (fetch + mostrar)
async function cargarDatos() { ... }
function mostrarDatos(datos) { ... }

// 5. Acciones (crear, editar, eliminar)
async function accion(id) { ... }

// 6. Helpers
function formatearFecha(fechaISO) { ... }

// 7. Llamar init() al final del archivo
init();
```

### Reglas de DOM
- **Usar `document.createElement` + `textContent` + `appendChild`** (nunca innerHTML con datos del usuario — riesgo de XSS)
- **Excepción**: `ver_gastos.js` usa innerHTML con template literals (patrón de la compañera, no copiar)
- Las clases CSS se aplican con `.className = 'clase'`
- Los estilos inline se usan solo cuando es necesario para layouts puntuales

### Conexión con la API
```javascript
// GET
const respuesta = await fetch(`${URL_API}/endpoint`);
if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
const datos = await respuesta.json();

// POST/PUT/PATCH
const respuesta = await fetch(`${URL_API}/endpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
});

// DELETE
const respuesta = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
```

### ID_USER hardcodeado
Actualmente `ID_USER = 3` (Jesús) en `tareas.js`. En `ingresar_gastos.js` es `ID_USER = 1`. Esto se cambiará cuando se implemente login real.

---

## 10. Frontend — Archivos y su relación HTML → JS

| HTML | JS | Descripción |
|---|---|---|
| `tareas.html` | `js/tareas.js` | Tablero kanban: 3 columnas (Disponibles, Mis tareas, Otros) |
| `gestion_tareas.html` | `js/gestion_tareas.js` | CRUD: form de creación + tabla con editar/eliminar inline |
| `ver_gastos.html` | `js/ver_gastos.js` | Lista de gastos + gráfico donut (Chart.js) + edición inline |
| `ingresar_gastos.html` | `js/ingresar_gastos.js` | Formulario para crear gastos |
| `dashboard.html` | `js/dashboard.js` | Página principal (contenido estático por ahora) |
| `index.html` | - | Placeholder Hello World |

---

## 11. Frontend — Detalle por archivo

### tareas.js (completo, funcional)

**Constantes:**
- `URL_API = 'http://localhost:8000/api/v1/tareas'`
- `ID_USER = 3`
- `coloresPorCategoria = { 1: '#00bfa5', 2: '#f5a623', 3: '#7c4dff', 4: '#00d4d4', 5: '#ff6b6b', 6: '#4ecdc4' }`

**Funciones:**
- `init()` → llama a cargarDisponibles, cargarMisTareas, cargarTareasDeOtros
- `cargarDisponibles()` → GET `/disponibles` → `mostrarDisponibles()`
- `cargarMisTareas()` → GET `/mias/${ID_USER}` → `mostrarMisTareas()`
- `cargarTareasDeOtros()` → GET `/otros/${ID_USER}` → `mostrarTareasDeOtros()`
- `mostrarDisponibles(tareas)` → renderiza cards con botón "Elegir tarea"
- `mostrarMisTareas(tareas)` → renderiza cards con botón "Marcar como hecha"
- `mostrarTareasDeOtros(tareas)` → renderiza cards con nombre de usuario
- `elegirTarea(id_tarea)` → POST `/${id_tarea}/usuarios` con `{ id_user: ID_USER }`
- `marcarHecha(id_tarea)` → PATCH `/${id_tarea}` con `{ estado: 'hecha' }`
- `formatearFecha(fechaISO)` → "25 jun"
- `infoTarea_clase(estado)` → "badge-pendiente" | "badge-en-progreso" | "badge-hecha"
- `ponerPrimeraLetraMayuscula(str)` → "Pendiente"

**Patrón de renderizado:** `document.createElement` con clases: `task-card`, `tx-dot`, `task-title`, `task-meta`, `badge-estado`, `btn-elegir`, `btn-hecha`

### gestion_tareas.js (incompleto — solo carga categorías)

**Lo que tiene:**
- `URL_API`
- `obtenerCategorias()` → GET `/nombre-categoria-tarea` → `mostrarCategoriasEnSelect()`
- `mostrarCategoriasEnSelect(categorias)` → popula `<select id="id_categoria">`
- `init()` → vacío

**Lo que falta (por implementar):**
- `cargarTareas()` → GET `/completas` → `mostrarTareasEnLista()`
- `mostrarTareasEnLista(tareas)` → renderiza filas con `tx-row`, editar, eliminar
- Handler del form `#form-crear-tarea` → POST `/`
- `activarModoEdicion(fila, tarea)` → edición inline con `construirFormularioEdicion()`
- `construirFormularioEdicion(tarea)` → construye form con `createElement` usando clases `.edit-form`
- `guardarEdicion(fila, tarea)` → PUT `/:id`
- `cancelarEdicion(fila)` → restaura contenido original
- `eliminarTarea(idTarea)` → DELETE `/:id` con confirm()
- Helpers: `formatearFecha()`, `obtenerClaseSegunEstado()`, `ponerPrimeraLetraMayuscula()`
- `categoriasEnCache` → variable global para cachear categorías

### ver_gastos.js (completo, de la compañera)

**Notas:**
- Usa `innerHTML` con template literals (patrón de la compañera)
- Usa inline styles para el layout del edit form
- Usa `tx-descripcion` y `tx-nombre` que NO existen en `style.css` (son `tx-name` y `tx-meta`) — bug conocido
- Maneja gráfico donut con Chart.js

### ingresar_gastos.js (completo, de la compañera)

**Notas:**
- Usa `DOMContentLoaded` para registrar el handler
- Carga categorías y métodos de pago en selects
- `ID_USER = 1` hardcodeado
- Bug conocido: usa `m.id_metodo` pero la columna se llama `id` en `metodo_pago`

---

## 12. CSS — Clases disponibles (style.css)

### Layout
| Clase | Qué hace |
|---|---|
| `.app-layout` | Flex container: sidebar + main |
| `.sidebar` | Sidebar fijo a la izquierda (220px) |
| `.main-content` | Contenido principal con margin-left |

### Sidebar
| Clase | Qué hace |
|---|---|
| `.sidebar-brand` | Nombre de la casa + miembros |
| `.sidebar-menu` | Container del nav |
| `.sidebar-item` | Links del menú |
| `.sidebar-item.active` | Link activo (fondo azul claro) |
| `.sidebar-user` | Avatar + info del usuario |
| `.avatar` | Círculo con la inicial |

### Página
| Clase | Qué hace |
|---|---|
| `.page-header` | Título + subtítulo + botón derecha |
| `.page-title` | H1 del título |
| `.page-subtitle` | Subtítulo gris |
| `.btn-add` | Botón verde teal (Volver, Gestionar, etc.) |

### Paneles y cards
| Clase | Qué hace |
|---|---|
| `.panel-card` | Card blanca con borde redondeado (14px) |
| `.panel-title` | Título del panel (negrita) |
| `.summary-card` | Card de resumen (dashboard) |
| `.task-card` | Card de tarea (kanban) |
| `.task-title` | Nombre de la tarea (negrita) |
| `.task-meta` | Info secundaria (gris, chica) |
| `.card-footer` | Footer de la card de "tareas de otros" |

### Transacciones / filas
| Clase | Qué hace |
|---|---|
| `.tx-row` | Fila de transacción/tarea (flex, border-bottom) |
| `.tx-dot` | Puntito de color (11px, borde redondeado) |
| `.tx-info` | Contenedor de texto (flex: 1) |
| `.tx-name` | Texto principal (0.88rem, negrita) |
| `.tx-meta` | Texto secundario (0.76rem, gris) |
| `.tx-amounts` | Montos (alineado a la derecha) |
| `.tx-total` | Monto total (negrita) |
| `.tx-each` | Monto por persona (gris) |

### Badges de estado
| Clase | Qué hace |
|---|---|
| `.badge-estado` | Base del badge (border-radius 999px) |
| `.badge-pendiente` | Amarillo: fondo #fff3cd, texto #856404 |
| `.badge-en-progreso` | Azul claro: fondo #cff4fc, texto #055160 |
| `.badge-hecha` | Verde: fondo #d1e7dd, texto #0a3622 |

### Botones de tarea
| Clase | Qué hace |
|---|---|
| `.btn-elegir` | Botón verde teal (Elegir tarea) |
| `.btn-hecha` | Botón outline verde (Marcar como hecha) |

### Botones de edición inline (para gestion_tareas)
| Clase | Qué hace |
|---|---|
| `.edit-form` | Container flex del form de edición |
| `.edit-form .edit-info` | Columna izquierda (descripción + notas) |
| `.edit-form .edit-datos` | Columna central (categoría + fecha) |
| `.edit-form .edit-acciones` | Columna derecha (botones) |

### Gráfico (dashboard/ver_gastos)
| Clase | Qué hace |
|---|---|
| `.chart-wrap` | Flex container del gráfico |
| `.legend` | Lista de leyendas |
| `.legend-item` | Item de la leyenda |
| `.legend-dot` | Puntito de color de la leyenda |

### Variables CSS (:root)
| Variable | Valor | Uso |
|---|---|---|
| `--sidebar-width` | 220px | Ancho del sidebar |
| `--accent` | #5b9cf6 | Azul accent |
| `--accent-soft` | #e8f0fe | Azul claro |
| `--teal` | #00bfa5 | Verde teal |
| `--teal-soft` | #e0f7f4 | Verde claro |
| `--border` | #f0f0f0 | Bordes |
| `--bg` | #f8f9fb | Fondo general |
| `--text-muted` | #888 | Texto gris |
| `--radius` | 14px | Border-radius general |

---

## 13. Git

### Ramas
- `development` → rama principal de desarrollo
- `feature/tareas-jesus` → rama de Jesús (actual)
- `release` → rama de release
- `fix/base-datos` → rama de otra compañera (cambios en ranking)

### Flujo
1. Trabajar en feature branch
2. Hacer commit con mensaje descriptivo
3. Push a origin
4. Crear PR → aprobación → merge a development
5. **NO** hacer merge directo a development desde terminal

### Formato de commits
```
tipo(ámbito): descripción corta

Ejemplos:
feature(tareas): Agrego endpoint PUT /:id para editar tareas
fix(tareas): Corrijo query getTareasCompletas() — agrego id_categoria al SELECT
feature(gastos): Conecto frontend de gastos a la API
```

---

## 14. Bugs Conocidos

1. **`ver_gastos.js`** usa clases `tx-descripcion` y `tx-nombre` que no existen en `style.css`. Las correctas son `tx-name` y `tx-meta`. No tocar (es de la compañera).

2. **`ingresar_gastos.js`** usa `m.id_metodo` pero la columna en `metodo_pago` se llama `id`. Avisar a la compañera.

3. **`ver_gastos.html`** tiene estilos inline duplicados que ya están en `style.css`. Es de la compañera, no tocar.

4. **`seeds.sql` duplicado**: existe `seed.sql` (el que usa Docker, desactualizado) y `seeds.sql` (el actual). Docker usa `seeds.sql`.

5. **`getTareasDisponibles(disponible)`** tiene un parámetro `disponible` que nunca se usa.

6. **`dashboard.js`** está vacío — el dashboard muestra contenido estático del HTML.

7. **`login.js`** tiene solo 1 línea — no hay sistema de autenticación. `ID_USER` está hardcodeado.

8. **`gestion_tareas.html`** tiene un error de sintaxis en el HTML: `required"` (comilla suelta) en el select de categorías.

---

## 15. Tareas Pendientes

### Inmediato
1. **Completar `gestion_tareas.js`** — implementar CRUD completo (listar, crear, editar inline, eliminar)
2. **Agregar clases CSS** de `.edit-form` a `style.css` para el formulario de edición inline

### Próximo
3. **Login real** — actualmente `ID_USER` hardcodeado. Implementar formulario de login, guardar ID en `localStorage`
4. **Dashboard dinámico** — `dashboard.js` está vacío, mostrar stats reales

### Mejoras
5. **Campo `diaria`** — existe en la BD pero no se muestra en las cards del kanban
6. **Aprobación de tareas** — discutir flujo de aprobación (estado intermedio)
7. **Unificar seeds** — eliminar `seed.sql` desactualizado

### Pendiente de coordinación
8. **Merge con `fix/base-datos`** — la compañera hizo cambios en ranking que hay que integrar

---

## 16. URLs de Prueba

```
# Backend
http://localhost:8000/health
http://localhost:8000/api/v1/tareas
http://localhost:8000/api/v1/tareas/completas
http://localhost:8000/api/v1/tareas/disponibles
http://localhost:8000/api/v1/tareas/mias/3
http://localhost:8000/api/v1/tareas/otros/3
http://localhost:8000/api/v1/tareas/nombre-categoria-tarea
http://localhost:8000/api/v1/tareas/ranking
http://localhost:8000/api/v1/gastos
http://localhost:8000/api/v1/gastos/total-mes
http://localhost:8000/api/v1/gastos/total-mes/usuario/1
http://localhost:8000/api/v1/gastos/categoria
http://localhost:8000/api/v1/gastos/nombre-categoria
http://localhost:8000/api/v1/gastos/metodo-pago

# Frontend
http://localhost:8080/tareas.html
http://localhost:8080/gestion_tareas.html
http://localhost:8080/ver_gastos.html
http://localhost:8080/ingresar_gastos.html
http://localhost:8080/dashboard.html
```
