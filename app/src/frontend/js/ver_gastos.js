const URL_API = "http://localhost:8000/api/v1/gastos";

const coloresPorCategoria = {
  1: "#00bfa5", // groceries
  2: "#00d4d4", // internet
  3: "#7c4dff", // utilities
  4: "#f5a623", // cleaning
  5: "#ff6b35", // other
};

async function obtenerGastos() {
  try {
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const gastos = await respuesta.json();
    mostrarTransacciones(gastos);
  } catch (error) {
    console.error("No se pudieron cargar los gastos:", error);
  }
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function mostrarTransacciones(gastos) {
  const contenedor = document.getElementById("lista-gastos");
  contenedor.innerHTML = "";

  gastos.forEach((gasto) => {
    const color = coloresPorCategoria[gasto.categoria] || "#999";
    const monto = parseFloat(gasto.monto).toFixed(2);

    const fila = document.createElement("div");
    fila.className = "tx-row";
    fila.innerHTML = `
      <span class="tx-dot" style="background:${color}"></span>
      <div class="tx-info">
        <div class="tx-descripcion">${gasto.descripcion}</div>
        <div class="tx-nombre"> ${gasto.nombre} · ${formatearFecha(gasto.fecha_gasto)}</div>
      </div>
      <div class="tx-amounts">
        <div class="tx-total">$${monto}</div>
        <div class="tx-each">${gasto.metodo_pago}</div>
      </div>
    `;
    contenedor.appendChild(fila);
  });
}

obtenerGastos();