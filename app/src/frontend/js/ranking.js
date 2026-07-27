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
    const fila = document.createElement("div");
    fila.className = "tx-row";
    fila.innerHTML = `
      <div class="tx-info">
        <div class="tx-name">#${index + 1} — ${usuario.nombre}</div>
      </div>
      <div class="tx-amounts">
        <div class="tx-total">${usuario.tareas_completadas} tareas</div>
      </div>
    `;
    contenedor.appendChild(fila);
  });
}

obtenerRanking();
