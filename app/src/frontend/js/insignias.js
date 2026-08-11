const URL_API = `${window.location.origin}/api/v1/insignias`;
const URL_API_TAREA = `${window.location.origin}/api/v1/tareas`;

let iconoElegidoCrear = null;

document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  cargarInsignias();

  cargarIconos(document.getElementById('icono-contenedor'), null, (id) => {
    iconoElegidoCrear = id;
  });

  const form = document.getElementById('form-crear-insignia');
  form.addEventListener('submit', crearInsignia);
});

async function cargarCategorias() {
  const respuesta = await fetch(`${URL_API_TAREA}/nombre-categoria-tarea`);
  const categorias = await respuesta.json();

  const select = document.getElementById("categoria");
  select.innerHTML = "";

  categorias.forEach(categoria => {
    const opcion = document.createElement("option");
    opcion.value = categoria.id_categoria;
    opcion.textContent = categoria.nombre;
    select.appendChild(opcion);
  });
}

async function crearInsignia(evento) {
  evento.preventDefault();

  const form = document.getElementById('form-crear-insignia');
  const datosFormulario = new FormData(form);
  const datos = Object.fromEntries(datosFormulario.entries());

  const nuevaInsignia = {
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    cant_tarea: parseInt(datos.cantidad),
    id_categoria_tarea: parseInt(datos.categoria),
    icono: iconoElegidoCrear || null,
  };

  const respuesta = await fetch(URL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaInsignia),
  });

  if (!respuesta.ok) {
    alert('Hubo un error al crear la insignia');
    return;
  }

  alert('¡Insignia registrada con éxito!');
  form.reset();
  iconoElegidoCrear = null;
  cargarIconos(document.getElementById('icono-contenedor'), null, (id) => {
    iconoElegidoCrear = id;
  });
  cargarInsignias();
}

async function cargarInsignias() {
  const respuesta = await fetch(URL_API);
  const insignias = await respuesta.json();
  mostrarInsignias(insignias);
}

function mostrarInsignias(insignias) {
  const contenedor = document.getElementById("lista-insignias");

  if (!insignias || insignias.length === 0) {
    contenedor.innerHTML = '<p class="has-text-grey has-text-centered">No hay insignias registradas</p>';
    return;
  }

  contenedor.innerHTML = "";

  insignias.forEach(insignia => {
    const fila = document.createElement("div");
    fila.className = "tx-row";

    fila.innerHTML = `
      <div class="tx-info" style="display:flex; align-items:center; gap:0.75rem;">
        <i class="fa-solid ${insignia.icono_clase || 'fa-star'}" style="color:${insignia.icono_color || '#999'}; font-size:1.4rem;"></i>
        <div>
          <div class="tx-name">${insignia.nombre}</div>
          <div class="tx-meta">${insignia.descripcion} · ${insignia.cant_tarea} tareas de ${insignia.categoria ?? ''}</div>
        </div>
      </div>
      <div class="edit-acciones">
        <button class="btn-hecha btn-editar-insignia">Editar</button>
        <button class="btn-hecha btn-borrar-insignia">Eliminar</button>
      </div>
    `;

    const botonEditar = fila.querySelector(".btn-editar-insignia");
    botonEditar.addEventListener("click", () => activarEdicionInsignia(fila, insignia));

    const botonBorrar = fila.querySelector(".btn-borrar-insignia");
    botonBorrar.addEventListener("click", () => borrarInsignia(insignia.id_insignia));

    contenedor.appendChild(fila);
  });
}

async function borrarInsignia(id) {
  const confirmar = confirm("¿Seguro que querés eliminar esta insignia?");
  if (!confirmar) return;

  await fetch(`${URL_API}/${id}`, { method: "DELETE" });
  cargarInsignias();
}

function activarEdicionInsignia(fila, insignia) {
  fila.innerHTML = `
    <div class="tx-info" style="display:flex; flex-direction:column; gap:0.4rem;">
      <input class="input is-small" id="edit-nombre" value="${insignia.nombre}">
      <input class="input is-small" id="edit-descripcion" value="${insignia.descripcion}">
      <input class="input is-small" id="edit-cant" type="number" value="${insignia.cant_tarea}">
      <select class="input is-small" id="edit-categoria"></select>
      <div id="edit-icono-contenedor"></div>
    </div>
    <div class="edit-acciones">
      <button class="btn-elegir" id="btn-guardar">Guardar</button>
      <button class="btn-hecha" id="btn-cancelar">Cancelar</button>
    </div>
  `;

  fetch(`${URL_API_TAREA}/nombre-categoria-tarea`)
    .then(respuesta => respuesta.json())
    .then(categorias => {
      const select = fila.querySelector("#edit-categoria");
      categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.id_categoria;
        opcion.textContent = categoria.nombre;
        if (categoria.id_categoria == insignia.id_categoria_tarea) {
          opcion.selected = true;
        }
        select.appendChild(opcion);
      });
    });

  let iconoElegido = insignia.icono;
  cargarIconos(fila.querySelector("#edit-icono-contenedor"), iconoElegido, (id) => {
    iconoElegido = id;
  });

  fila.querySelector("#btn-guardar").addEventListener("click", () => guardarEdicion(fila, insignia, () => iconoElegido));
  fila.querySelector("#btn-cancelar").addEventListener("click", () => cargarInsignias());
}

async function guardarEdicion(fila, insignia, obtenerIcono) {
  const datosActualizados = {
    nombre: fila.querySelector("#edit-nombre").value,
    descripcion: fila.querySelector("#edit-descripcion").value,
    cant_tarea: parseInt(fila.querySelector("#edit-cant").value),
    id_categoria_tarea: parseInt(fila.querySelector("#edit-categoria").value),
    icono: obtenerIcono() || null,
  };

  const respuesta = await fetch(`${URL_API}/${insignia.id_insignia}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizados),
  });

  if (!respuesta.ok) {
    alert("Hubo un error al guardar");
    return;
  }

  cargarInsignias();
}

async function cargarIconos(contenedor, iconoSeleccionadoId = null, alSeleccionar = null) {
  const respuesta = await fetch(`${URL_API}/iconos`);
  const iconos = await respuesta.json();

  const iconoActual = iconos.find(i => i.id_icono == iconoSeleccionadoId);

  contenedor.innerHTML = "";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "input is-medium";
  boton.style.cssText = "display:flex; align-items:center; gap:0.5rem; width:100%; cursor:pointer; text-align:left;";
  boton.innerHTML = htmlDeIcono(iconoActual);

  const panel = document.createElement("div");
  panel.className = "panel-iconos";
  panel.style.cssText = "display:none; position:absolute; background:#fff; border:1px solid #ddd; border-radius:4px; z-index:10; max-height:200px; overflow-y:auto; box-shadow:0 2px 6px rgba(0,0,0,0.1); width:100%;";

  const opciones = [{ id_icono: "", nombre: "Sin icono" }, ...iconos];

  opciones.forEach(icono => {
    const item = document.createElement("div");
    item.style.cssText = "padding:0.5rem; display:flex; align-items:center; gap:0.5rem; cursor:pointer;";
    item.innerHTML = htmlDeIcono(icono.id_icono ? icono : null);

    item.addEventListener("mouseenter", () => item.style.background = "#f5f5f5");
    item.addEventListener("mouseleave", () => item.style.background = "");

    item.addEventListener("click", () => {
      boton.innerHTML = item.innerHTML;
      panel.style.display = "none";
      if (alSeleccionar) alSeleccionar(icono.id_icono || "");
    });

    panel.appendChild(item);
  });

  boton.addEventListener("click", (evento) => {
    evento.stopPropagation();
    document.querySelectorAll(".panel-iconos").forEach(otroPanel => {
      if (otroPanel !== panel) otroPanel.style.display = "none";
    });
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", () => panel.style.display = "none");

  contenedor.style.position = "relative";
  contenedor.appendChild(boton);
  contenedor.appendChild(panel);
}

function htmlDeIcono(icono) {
  if (!icono) return `<span>Sin icono</span>`;
  return `<i class="fa-solid ${icono.clase}" style="color:${icono.color || '#999'}"></i><span>${icono.nombre}</span>`;
}