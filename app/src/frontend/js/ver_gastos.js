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

async function obtenerGastoMes() {
  try {
    const respuesta = await fetch(`${URL_API}/total-mes`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const gasto = await respuesta.json();
    mostrarGastoDelMes(gasto.total);
  } catch (error) {
    console.error("No se pudieron cargar los gastos:", error);
  }
}

function mostrarGastoDelMes(gasto) {
  const contenedor = document.getElementById("gasto-mes");
  contenedor.textContent = `$${gasto}`;
}

async function obtenerGastoMesUsuario() {
  try {
    const respuesta = await fetch(`${URL_API}/total-mes/usuario/1`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const gasto = await respuesta.json();
    console.log("GASTO USUARIO")
    console.log(gasto.total)
    mostrarGastoDelMesUsuario(gasto.total);
  } catch (error) {
    console.error("No se pudieron cargar los gastos:", error);
  }
}

function mostrarGastoDelMesUsuario(gasto) {
  const contenedor = document.getElementById("gasto-user");
  contenedor.textContent = `$${gasto}`;
}

// Colores para asignar a cada categoría, en el orden en que lleguen
const coloresCategorias = ['#00bfa5', '#7c4dff', '#f5a623', '#00d4d4', '#ff6b35'];

async function obtenerGastosPorCategoria() {
  try {
    const respuesta = await fetch(`${URL_API}/categoria`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const categorias = await respuesta.json();
    mostrarGrafico(categorias);
  } catch (error) {
    console.error("No se pudieron cargar las categorías:", error);
  }
}

function mostrarGrafico(categorias) {
  const etiquetas = categorias.map(c => c.nombre);
  const valores = categorias.map(c => parseFloat(c.total_monto));
  const colores = categorias.map((c, i) => coloresCategorias[i % coloresCategorias.length]);
  const totalGeneral = valores.reduce((suma, v) => suma + v, 0);

  new Chart(document.getElementById('donut'), {
    type: 'doughnut',
    data: {
      labels: etiquetas,
      datasets: [{
        data: valores,
        backgroundColor: colores,
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 6,
      }]
    },
    options: {
      cutout: '68%',
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      animation: { animateRotate: true, duration: 700 }
    }
  });

  // Mostrar las categorias
  const contenedorLeyenda = document.querySelector('.legend');
  contenedorLeyenda.innerHTML = "";
  categorias.forEach((categoria, i) => {
    const monto = parseFloat(categoria.total_monto);
    const porcentaje = ((monto / totalGeneral) * 100).toFixed(0);
    const color = coloresCategorias[i % coloresCategorias.length];
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <span class="legend-dot" style="background:${color}"></span>
      <span class="legend-name">${categoria.nombre}</span>
      <span class="legend-amount">$${monto.toFixed(2)}</span>
      <span class="legend-pct">(${porcentaje}%)</span>
    `;
    contenedorLeyenda.appendChild(item);
  });
}
obtenerGastosPorCategoria()
obtenerGastos()
obtenerGastoMes()
obtenerGastoMesUsuario()