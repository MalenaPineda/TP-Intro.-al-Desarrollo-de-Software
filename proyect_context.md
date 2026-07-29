# CoLiving — Project Knowledge Base

## Visión General y Objetivos

App de gestión de convivencia para roomies. Permite gestionar tareas del hogar, gastos compartidos y gamificación con insignias. Es el trabajo práctico final de la materia "Introducción al Desarrollo de Software".

**Equipo:**
- Jesús → feature/tareas-jesus (tareas, backend y frontend)
- Eugenia/compañera → gastos, ver_gastos, ingresar_gastos
- Maru/Malena → coordinación, DB, otras funciones

**Stack:**
- Backend: Node.js + Express 5 (ES Modules — usar `import/export`, NO `require`)
- Base de datos: PostgreSQL 18
- Contenedores: Docker + Docker Compose
- Frontend: HTML/CSS/JS vanilla + Bulma + Font Awesome
- Nodemon para desarrollo (solo devDependency)
- Thunder Client (VS Code) para probar endpoints

---

## Arquitectura y Decisiones Clave

### Estructura de carpetas
```
TP-Intro.-al-Desarrollo-de-Software/
├── Dockerfile
├── Makefile
├── docker-compose.yml
└── app/
    ├── app.js                          ← entrada del servidor
    ├── package.json
    ├── .env
    ├── db/
    │   ├── pool.js                     ← conexión PostgreSQL
    │   ├── tareas.js                   ← queries de tareas
    │   ├── gastos.js                   ← queries de gastos
    │   ├── schemas.sql                 ← schema de la BD
    │   └── seed.sql                    ← datos de prueba (Docker usa este)
    └── src/
        ├── backend/api/
        │   ├── tareas.js               ← endpoints de tareas
        │   └── gastos.js               ← endpoints de gastos
        └── frontend/
            ├── css/style.css
            ├── js/
            │   ├── tareas.js           ← lógica frontend tareas
            │   ├── ver_gastos.js
            │   └── ingresar_gastos.js
            ├── tareas.html
            ├── ver_gastos.html
            └── ingresar_gastos.html
```

### Convenciones de código

- **ES Modules**: siempre `import/export`, nunca `require`
- **Patrón**: `db/tareas.js` hace las queries SQL, `api/tareas.js` tiene las rutas + validaciones
- **Parámetros SQL**: siempre usar `$1, $2...` con array de valores (nunca concatenar strings — SQL injection)
- **`RETURNING *`**: agregar al final de INSERT/UPDATE/DELETE para devolver la fila afectada
- **async/await**: todas las funciones que hacen queries son `async`
- **try/catch**: siempre en los endpoints; responder 400 para datos inválidos, 404 si no existe, 500 para errores del servidor
- **DOM**: usar `createElement` + `textContent` + `appendChild` (NO `innerHTML` — XSS)
- **Frontend**: `ID_USER = 1` hardcodeado hasta implementar login real

### Docker
- Nodemon corre dentro del contenedor con volúmenes montados (`./app:/app`)
- Para resetear la BD: `docker compose down && sudo rm -rf ./data && docker compose up --build`
- Host de la BD dentro de Docker: `"db"` (nombre del servicio), NO `"localhost"`
- PostgreSQL 18 monta datos en `/var/lib/postgresql` (sin `/data` al final)

### Git
- Rama principal de desarrollo: `development`
- Rama de Jesús: `feature/tareas-jesus`
- Flujo: trabajar en feature branch → PR → aprobación → merge a development
- NO hacer merge directo desde terminal a development en equipo

---

## Schema de Base de Datos

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

**Estados válidos de tareas:** `'pendiente'`, `'en progreso'`, `'hecha'`

---

## Estado Actual del Desarrollo

### ✅ Backend — Tareas (completo)

**`app/db/tareas.js`** — todas estas funciones implementadas:
- `getTareas()` — SELECT * FROM tareas
- `getTareasPorId(id)` — por id
- `crearTarea(descripcion, fecha_vencimiento, id_categoria, notas)` — INSERT
- `borrarTarea(id)` — DELETE
- `cambiarEstadoTarea(id, estado)` — UPDATE estado
- `getTareasCompletas()` — JOIN con categoria_tareas y usuarios, usa `array_agg` para agrupar usuarios
- `asignarUsuario(id_tarea, id_user)` — INSERT en tarea_user
- `getTareasDisponibles()` — LEFT JOIN tarea_user WHERE id_tarea IS NULL
- `getMisTareas(id_user)` — tareas del usuario
- `getTareasDeOtros(id_user)` — tareas de otros usuarios
- `getRankingTareas()` — COUNT tareas completadas por usuario (agregado por compañera)

**`app/src/backend/api/tareas.js`** — endpoints implementados:
- `GET /api/v1/tareas/disponibles`
- `GET /api/v1/tareas/completas`
- `GET /api/v1/tareas/mias/:id_user`
- `GET /api/v1/tareas/otros/:id_user`
- `GET /api/v1/tareas/`
- `GET /api/v1/tareas/:id`
- `POST /api/v1/tareas/` — crear tarea
- `DELETE /api/v1/tareas/:id`
- `PATCH /api/v1/tareas/:id` — cambiar estado (valida estados válidos)
- `POST /api/v1/tareas/:id/usuarios` — asignar usuario
- `GET /api/v1/tareas/ranking` — ranking de tareas completadas

**Importante sobre el orden de rutas:** las rutas específicas (`/disponibles`, `/completas`, `/mias/:id_user`, etc.) van ANTES de `/:id` para que Express no las confunda.

### ✅ Backend — Gastos (compañera, completo)

Endpoints en `/api/v1/gastos`: GET, POST crear, total-mes, total-mes/usuario/:id, categoria, nombre-categoria, metodo-pago.

### ✅ Frontend — Tareas (funcional)

**`app/src/frontend/tareas.html`** — tres columnas: Disponibles, Mis tareas, Tareas de otros. Usa `css/style.css` y `js/tareas.js`.

**`app/src/frontend/js/tareas.js`** — implementado:
- `init()` — carga las tres columnas al iniciar
- `cargarDisponibles()` / `mostrarDisponibles()` — con botón "Elegir tarea"
- `cargarMisTareas()` / `mostrarMisTareas()` — con botón "Marcar como hecha" (oculto si ya está hecha)
- `cargarTareasDeOtros()` / `mostrarTareasDeOtros()` — solo lectura
- `elegirTarea(id_tarea)` — POST a `/tareas/:id/usuarios`, recarga con `init()`
- `marcarHecha(id_tarea)` — PATCH estado a 'hecha', recarga con `init()`
- `formatearFecha(fechaISO)` — convierte ISO a formato legible
- `infoTarea_clase(estado)` — devuelve clase CSS del badge según estado
- Colores por categoría: `{ 1: '#00bfa5', 2: '#f5a623', 3: '#7c4dff', 4: '#00d4d4' }`
- `ID_USER = 3` hardcodeado (Pedro en el seed actual)

### ✅ Frontend — Gastos (compañera, completo)

`ver_gastos.html` + `ver_gastos.js` + `ingresar_gastos.html` + `ingresar_gastos.js`

### ✅ CSS compartido

`css/style.css` tiene estilos para: sidebar, layout, cards, badges, botones, tasks-grid, tx-dot, badges de estado.

---

## Tareas Pendientes y Próximos Pasos

### Inmediato — lo que estábamos por hacer

1. **Formulario para crear tarea** (`ingresar_tarea.html` + `js/ingresar_tarea.js`)
   - Similar a `ingresar_gastos.html` de la compañera
   - Campos: descripción, fecha_vencimiento, categoría (select dinámico), notas, diaria (checkbox)
   - Llama a `POST /api/v1/tareas/`
   - Necesita endpoint `GET /api/v1/tareas/categorias` para llenar el select (o reutilizar categoria_tareas directamente)

2. **Botón eliminar tarea** en las cards de "Mis tareas"
   - Llama a `DELETE /api/v1/tareas/:id`

3. **Formulario para editar tarea** (o modal inline)
   - Necesita `PUT /tareas/:id` en el backend (aún no implementado)
   - Campos editables: descripción, fecha_vencimiento, categoría, notas

### Pendiente general

- **Login real**: actualmente `ID_USER` está hardcodeado. Cuando se implemente, guardar en `localStorage` y leer desde ahí.
- **Recurrencia en el front**: el campo `diaria BOOLEAN` existe en la BD pero no se muestra en las cards.
- **Aprobación de tareas**: discutir con el equipo si se implementa flujo de aprobación (estado intermedio).
- **Merge pendiente con rama de compañera**: hay una rama `fix/base-datos` con cambios de otra compañera que tocó `api/tareas.js` y `db/tareas.js` para agregar ranking. Coordinar merge para no pisar código.
- **`seeds.sql` duplicado**: existe `seed.sql` (el que usa Docker) y `seeds.sql` (de compañera, con errores). Elegir uno.
- **Parámetro sin usar**: `getTareasDisponibles(disponible)` tiene un parámetro `disponible` que nunca se usa — quitarlo.

### Bugs conocidos

- `ingresar_gastos.js` usa `m.id_metodo` pero la columna se llama `id` en la tabla `metodo_pago` — avisarle a la compañera.
- `ver_gastos.html` tiene estilos duplicados (inline + link al CSS) — es de la compañera, no tocar.

---

## Comandos útiles

```bash
# Levantar todo
docker compose up --build

# Resetear BD (cuando cambia el schema o seed)
docker compose down && sudo rm -rf ./data && docker compose up --build

# Correr frontend
cd app/src/frontend && npx http-server -p 8080
# O con Makefile:
make run

# Ver logs del servidor
docker compose logs -f convivencia-api

# Conectarse a la BD
docker compose exec db psql -U postgres -d postgres
```

## URLs de prueba

```
http://localhost:8000/api/v1/tareas
http://localhost:8000/api/v1/tareas/disponibles
http://localhost:8000/api/v1/tareas/mias/3
http://localhost:8000/api/v1/tareas/otros/3
http://localhost:8000/api/v1/gastos
http://localhost:8080/tareas.html
http://localhost:8080/ver_gastos.html
```