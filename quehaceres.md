# Quehaceres - CoLiving

Plan de trabajo pendiente. Organizado por fases.

---

## Fase 1: Correcciones y fixes en tareas

### 1.1 Corregir mapa de colores
- Archivo: `app/src/frontend/js/tareas.js`
- El `coloresPorCategoria` tiene los IDs desalineados con la DB
- Reescribir con los IDs correctos:
  ```
  1: Limpieza
  2: Cocina
  3: Mantenimiento
  4: Jardinería
  5: Mascotas
  6: Compras
  ```

### 1.2 Capitalizar primera letra
- Archivo: `app/src/frontend/js/tareas.js`
- Crear helper `capitalizar(str)` → `str.charAt(0).toUpperCase() + str.slice(1)`
- Usarlo en: estados de badge, nombres de categoría, etc.

### 1.3 Bullets en títulos de columna
- Archivo: `app/src/frontend/tareas.html`
- Devolver los bullets `●` en los títulos de columna:
  - `● Disponibles`
  - `● Mis tareas`
  - `● Tareas de otros`

### 1.4 Mostrar asignado en cards
- Archivo: `app/src/frontend/js/tareas.js`
- En `mostrarDisponibles`: agregar nombre del asignado (si lo tiene)

### 1.5 Eliminar import muerto
- Archivo: `app/src/frontend/js/tareas.js`
- Eliminar línea 1: `//import { application } from "express"`

---

## Fase 2: Página "Crear Tarea"

### 2.1 Crear página
- Archivo nuevo: `app/src/frontend/ingresar_tareas.html`
- Mismo layout que `ingresar_gastos.html` (sidebar + contenedor centrado)
- Sidebar con links correctos (`dashboard`, `ver_gastos`, `tareas`)
- Formulario con campos:
  - Descripción (text, required)
  - Categoría (select, required, cargado desde JS)
  - Fecha de vencimiento (date)
  - Notas (textarea)
- Botón "Crear tarea" con ícono `fa-circle-plus`
- Link "Volver a tareas"

### 2.2 Crear JS del formulario
- Archivo nuevo: `app/src/frontend/js/ingresar_tareas.js`
- Popular select de categorías (hardcodear las 6, no hay endpoint)
- Al submit: `POST /api/v1/tareas` con los campos del form
- Redirigir a `tareas.html` después de crear exitosamente
- Manejar errores

### 2.3 Agregar botón en tareas
- Archivo: `app/src/frontend/tareas.html`
- Botón "Crear tarea" en el page header (ícono `fa-circle-plus`)
- Link a `ingresar_tareas.html`

---

## Fase 3: Limpiar ver_gastos.html

### 3.1 Eliminar estilo inline
- Archivo: `app/src/frontend/ver_gastos.html`
- Eliminar el bloque `<style>` completo (líneas 12-157)
- Ya tiene `style.css` vinculado, el inline sobra y genera inconsistencias

### 3.2 Corregir sidebar
- Archivo: `app/src/frontend/ver_gastos.html`
- Link de Tareas: `href="#"` → `href="tareas"`

---

## Fase 4: Selección de usuario (dropdown en sidebar)

### 4.1 Crear endpoint de usuarios
- Archivo nuevo: `app/db/usuarios.js`
  - `getUsuarios()` → SELECT * FROM usuarios
  - `getUsuarioPorId(id)` → SELECT * FROM usuarios WHERE id_user = $1
- Archivo nuevo: `app/src/backend/api/usuarios.js`
  - `GET /` → listar todos los usuarios
  - `GET /:id` → usuario por ID

### 4.2 Registrar ruta en app.js
- Archivo: `app/app.js`
- Agregar: `app.use("/api/v1/usuarios", rutaUsuarios)`

### 4.3 Crear JS compartido
- Archivo nuevo: `app/src/frontend/js/shared.js`
- `getUserId()` → lee de `localStorage` o devuelve 3 (default)
- `setUserId(id)` → guarda en `localStorage`
- `cargarUsuarioSidebar()` → fetch del usuario actual y actualiza avatar/nombre en el sidebar

### 4.4 Modificar sidebar en todas las páginas
- Archivos: `tareas.html`, `ver_gastos.html`, `dashboard.html`, `ingresar_gastos.html`
- Reemplizar el `sidebar-user` estático por un dropdown
- Al hacer click en el avatar/nombre: desplegar lista de usuarios
- Al elegir uno: `setUserId(id)` + recargar página

### 4.5 Actualizar JS existentes
- `js/tareas.js`: reemplazar `const ID_USER = 3` por `getUserId()`
- `js/ver_gastos.js`: reemplazar `id_user = 1` por `getUserId()`
- `js/ingresar_gastos.js`: reemplazar `id_user = 1` por `getUserId()`
- Todos deben incluir `<script src="js/shared.js">` antes de su JS

---

## Fase 5: Página de perfil de usuario

### 5.1 Crear página
- Archivo nuevo: `app/src/frontend/perfil.html`
- Sidebar con dropdown de usuario
- Info del usuario: nombre, email, fecha de nacimiento
- Sección "Mis tareas" (con badge de estado)
- Sección "Mis gastos" (lista)
- Sección "Insignias" (con icono y estado)

### 5.2 Crear JS del perfil
- Archivo nuevo: `app/src/frontend/js/perfil.js`
- Leer `userId` de la URL (`?id=3`) o del `localStorage`
- Fetch: `GET /api/v1/usuarios/:id`
- Fetch: `GET /api/v1/tareas/mias/:id`
- Fetch: `GET /api/v1/gastos/total-mes/usuario/:id`
- Fetch: insignias del usuario

### 5.3 Agregar endpoint de insignias
- Archivo: `app/src/backend/api/usuarios.js`
- `GET /:id/insignias` → JOIN de `user_insignia` con `insignias`

### 5.4 Link al perfil
- En el sidebar, al hacer click en el nombre del usuario → navegar a `perfil.html?id=X`

---

## Archivos nuevos a crear

| Archivo | Descripción |
|---------|-------------|
| `app/db/usuarios.js` | Queries de usuarios |
| `app/src/backend/api/usuarios.js` | Router de endpoints de usuarios |
| `app/src/frontend/ingresar_tareas.html` | Formulario de crear tarea |
| `app/src/frontend/js/ingresar_tareas.js` | Lógica del form de crear tarea |
| `app/src/frontend/perfil.html` | Página de perfil de usuario |
| `app/src/frontend/js/perfil.js` | Lógica del perfil |
| `app/src/frontend/js/shared.js` | Funciones compartidas (userId, sidebar) |

## Archivos a modificar

| Archivo | Cambios |
|---------|---------|
| `app/app.js` | Registrar ruta de usuarios |
| `app/src/frontend/tareas.html` | Bullets, botón crear, sidebar dropdown |
| `app/src/frontend/ver_gastos.html` | Eliminar `<style>` inline, corregir sidebar |
| `app/src/frontend/dashboard.html` | Sidebar dropdown |
| `app/src/frontend/ingresar_gastos.html` | Sidebar dropdown |
| `app/src/frontend/js/tareas.js` | Colores, capitalizar, userId |
| `app/src/frontend/js/ver_gastos.js` | userId dinámico |
| `app/src/frontend/js/ingresar_gastos.js` | userId dinámico |
| `app/src/frontend/css/style.css` | Estilos dropdown, perfil |

---

## Fase 6: Gestión de tareas (CRUD) — En progreso

### 6.1 Completado
- [x] HTML: `gestion_tareas.html` con formulario de creación + contenedor de tabla
- [x] CSS: Clases `.edit-form`, `.edit-info`, `.edit-datos`, `.edit-acciones` en `style.css`
- [x] Backend: `GET /nombre-categoria-tarea`, `PUT /:id`, `DELETE /:id`
- [x] JS: init(), obtenerCategorias(), cargarTareas(), mostrarTareasEnLista()
- [x] JS: crearFila(), registrarHandlerFormulario()
- [x] JS: activarModoEdicion(), construirFormularioEdicion(), cancelarEdicion()
- [x] JS: guardarEdicion(), eliminarTarea()
- [x] JS: Helpers (formatearFecha, formatoInputFecha, obtenerClasesSegunEstado, ponerPrimeraLetraMayuscula)

### 6.2 Errores conocidos
- [ ] **Eliminar**: al eliminar una tarea, no se quita de la fila en la UI
  - Posible causa: error en el fetch DELETE o la tabla no se recarga correctamente
  - Verificar: consola del navegador (F12) para ver si hay errores
  - Verificar: endpoint DELETE /:id funciona con Thunder Client
- [ ] **Usuarios**: `tarea.usuario` viene como array `["nombre"]` o `[null]`
  - Línea 103: falta usar `?.[0]` para sacar el elemento del array
- [ ] **Fecha input**: línea 224 llama a `formatearFechaInput()` pero la función se llama `formatoInputFecha()`
