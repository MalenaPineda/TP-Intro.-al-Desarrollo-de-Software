const URL_API_RANKING = "http://localhost:8000/api/v1/tareas/ranking";
async function obtenerRanking() {
  try {
    const respuesta = await fetch(URL_API_RANKING);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const ranking = await respuesta.json();
    mostrarRanking(ranking);
  } catch (error) {
    console.error("No se pudo cargar el ranking:", error);
  }
}
function mostrarRanking(ranking) {
  const contenedor = document.getElementById("lista-ranking");
  contenedor.innerHTML = "";
  if (ranking.length === 0) {
    contenedor.innerHTML = "<p>Todavía no hay tareas completadas.</p>";
    return;
  }
  ranking.forEach((usuario, index) => {
    const insigniasHtml = usuario.insignias.length > 0
      ? usuario.insignias.map((i) => {
          const clase = i.icono_clase || "fa-medal";
          const color = i.icono_color || "#FFD700";
          return `<span title="${i.nombre}" style="margin-right: 0.5rem;"><i class="fa-solid ${clase}" style="color:${color};"></i> ${i.nombre}</span>`;
        }).join("")
      : "";
    const fila = document.createElement("div");
    fila.className = "tx-row";
    fila.innerHTML = `
      <div class="tx-info">
        <div class="tx-name">#${index + 1} — ${usuario.nombre}</div>
        <div class="tx-meta">${insigniasHtml}</div>
      </div>
      <div class="tx-amounts">
        <div class="tx-total">${usuario.tareas_completadas} ${Number(usuario.tareas_completadas) === 1 ? "tarea" : "tareas"}</div>
      </div>
    `;
    contenedor.appendChild(fila);
  });
}
obtenerRanking();

const URL_API_PUNTOS = "http://localhost:8000/api/v1/tareas/puntos-del-mes";

const coloresNivel = {
  "Novato": "#8bc34a",
  "Colaborador": "#00bfa5",
  "Experto": "#7c4dff",
  "Maestro de la casa": "#ffd700"
};

async function obtenerPuntos() {
  try {
    const respuesta = await fetch(URL_API_PUNTOS);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const puntos = await respuesta.json();
    mostrarPuntos(puntos);
  } catch (error) {
    console.error("No se pudieron cargar los puntos:", error);
  }
}

function mostrarPuntos(puntos) {
  const contenedor = document.getElementById("lista-puntos");
  contenedor.innerHTML = "";
  if (puntos.length === 0) {
    contenedor.innerHTML = "<p>Todavía no hay puntos este mes.</p>";
    return;
  }
  puntos.forEach((usuario) => {
    const color = coloresNivel[usuario.nivel] || "#888";
    const fila = document.createElement("div");
    fila.className = "tx-row";
    fila.innerHTML = `
      <div class="tx-info">
        <div class="tx-name">${usuario.nombre}</div>
        <div class="tx-meta"><span style="color:${color}; font-weight:600;">${usuario.nivel}</span></div>
      </div>
      <div class="tx-amounts">
        <div class="tx-total">${usuario.puntos} pts</div>
      </div>
    `;
    contenedor.appendChild(fila);
  });
}

obtenerPuntos();