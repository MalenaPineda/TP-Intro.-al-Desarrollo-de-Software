const URL_API = 'http://localhost:8000/api/v1/insignias';
const URL_API_TAREA = "http://localhost:8000/api/v1/tareas";

obtenerCategorias();
cargarInsignias();
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-crear-insignia');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const insignia = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      cant_tarea: parseInt(data.cantidad),
      id_categoria_tarea: parseInt(data.categoria),
      // icono: data.icono,
    };

    try {
      const response = await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insignia),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar la insignia');
      }
      const result = await response.json();
      console.log('Insignia registrada:', result);
      alert('¡Insignia registrada con éxito!');
      form.reset();
      await cargarInsignias(); // recarga la lista después de crear
    } catch (error) {
      console.error(error);
      alert('Hubo un error: ' + error.message);
    }
  });
});

async function obtenerCategorias() {
  try {
    const respuesta = await fetch(`${URL_API_TAREA}/nombre-categoria-tarea`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const categorias = await respuesta.json();
    mostrarCategorias(categorias);
  } catch (error) {
    console.error("No se pudieron cargar las categorías:", error);
  }
}

function mostrarCategorias(categorias) {
  const contenedor = document.getElementById("categoria");
  contenedor.innerHTML = "";

  categorias.forEach((c) => {
    const opcion = document.createElement("option");
    opcion.value = c.id_categoria;
    opcion.textContent = c.nombre;
    contenedor.appendChild(opcion);
  });
}

async function cargarInsignias() {
  try {
    const res = await fetch(URL_API);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const insignias = await res.json();
    mostrarInsignias(insignias);
  } catch (error) {
    console.error("Error al cargar insignias:", error);
  }
}

function mostrarInsignias(insignias) {
  const contenedor = document.getElementById("lista-insignias");
  contenedor.innerHTML = "";

  if (insignias.length === 0) {
    contenedor.innerHTML = '<p class="has-text-grey has-text-centered">No hay insignias registradas</p>';
    return;
  }

  insignias.forEach(insignia => {
    const fila = document.createElement("div");
    fila.className = "tx-row";
    fila.innerHTML = `
      <div class="tx-info">
        <div class="tx-name">${insignia.nombre}</div>
        <div class="tx-meta">${insignia.descripcion} · ${insignia.cant_tarea} tareas de ${insignia.categoria}</div>
      </div>
      <div class="edit-acciones">
        <button class="btn-hecha btn-editar-insignia">Editar</button>
        <button class="btn-hecha btn-borrar-insignia">Eliminar</button>
      </div>
    `;

    fila.querySelector(".btn-editar-insignia").addEventListener("click", () => activarEdicionInsignia(fila, insignia));
    fila.querySelector(".btn-borrar-insignia").addEventListener("click", () => borrarInsignia(insignia.id_insignia));

    contenedor.appendChild(fila);
  });
}

async function borrarInsignia(id) {
  const confirmar = confirm("¿Seguro que querés eliminar esta insignia?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${URL_API}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    await cargarInsignias();
  } catch (error) {
    console.error("Error al borrar insignia:", error);
  }
}

function activarEdicionInsignia(fila, insignia) {
    fila.innerHTML = `
      <div class="tx-info" style="display:flex; flex-direction:column; gap:0.4rem;">
        <input class="input is-small" id="edit-nombre" value="${insignia.nombre}">
        <input class="input is-small" id="edit-descripcion" value="${insignia.descripcion}">
        <input class="input is-small" id="edit-cant" type="number" value="${insignia.cant_tarea}">
        <select class="input is-small" id="edit-categoria"></select>
        <select class="input is-small" id="edit-icono">
          <option value="">Sin icono</option>
          <option value="fa-broom">🧹 Limpieza</option>
          <option value="fa-utensils">🍴 Cocina</option>
          <option value="fa-wrench">🔧 Mantenimiento</option>
          <option value="fa-leaf">🌿 Jardinería</option>
          <option value="fa-paw">🐾 Mascotas</option>
          <option value="fa-star">⭐ Estrella</option>
          <option value="fa-trophy">🏆 Trofeo</option>
          <option value="fa-medal">🥇 Medalla</option>
          <option value="fa-crown">👑 Corona</option>
          <option value="fa-fire">🔥 Fuego</option>
        </select>
      </div>
      <div class="edit-acciones">
        <button class="btn-elegir" id="btn-guardar">Guardar</button>
        <button class="btn-hecha" id="btn-cancelar">Cancelar</button>
      </div>
    `;
  
    // Cargar categorías en el select
    fetch(`${URL_API_TAREA}/nombre-categoria-tarea`)
      .then(r => r.json())
      .then(cats => {
        const sel = fila.querySelector("#edit-categoria");
        sel.innerHTML = cats.map(c =>
          `<option value="${c.id_categoria}" ${c.id_categoria == insignia.id_categoria_tarea ? "selected" : ""}>${c.nombre}</option>`
        ).join("");
      });
  
    // Preseleccionar icono actual
    const selectIcono = fila.querySelector("#edit-icono");
    if (insignia.icono) selectIcono.value = insignia.icono;
  
    fila.querySelector("#btn-guardar").addEventListener("click", async () => {
      const data = {
        nombre: fila.querySelector("#edit-nombre").value,
        descripcion: fila.querySelector("#edit-descripcion").value,
        cant_tarea: parseInt(fila.querySelector("#edit-cant").value),
        id_categoria_tarea: parseInt(fila.querySelector("#edit-categoria").value),
        icono: fila.querySelector("#edit-icono").value || null,
      };
      try {
        const res = await fetch(`${URL_API}/${insignia.id_insignia}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al guardar");
        await cargarInsignias();
      } catch (error) {
        console.error(error);
        alert("Hubo un error al guardar");
      }
    });
  
    fila.querySelector("#btn-cancelar").addEventListener("click", () => cargarInsignias());
  }
