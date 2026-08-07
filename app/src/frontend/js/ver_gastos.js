const URL_API = "http://localhost:8000/api/v1/gastos";

const coloresPorCategoria = {
  1: "#00bfa5",
  2: "#00d4d4",
  3: "#7c4dff",
  4: "#f5a623",
  5: "#ff6b35",
};
const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

ID_USER = 1

async function obtenerGastos() {
  try {
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const gastos = await respuesta.json();
    mostrarTransacciones(gastos);
  } catch (error) {
    console.error("No se pudieron cargar los gastos:", error);
  }
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return 'Sin fecha límite';
  const [anio, mes, dia] = fechaISO.substring(0, 10).split('-');
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

function mostrarTransacciones(gastos) {
  const contenedor = document.getElementById("lista-gastos");
  contenedor.innerHTML = "";
  if (gastos.length === 0) {
    contenedor.innerHTML = "<p>No hay registros de gastos</p>";
    return;
  }

  gastos.forEach((gasto) => {
    const color = coloresPorCategoria[gasto.categoria] || "#999";
    const monto = parseFloat(gasto.monto).toFixed(2);

    const fila = document.createElement("div");
    fila.className = "tx-row";
    fila.dataset.id = gasto.id_gasto;
    fila.innerHTML = `
      <span class="tx-dot" style="background:${color}"></span>
      <div class="tx-info">
        <div class="tx-descripcion">${gasto.descripcion}</div>
        <div class="tx-nombre">${gasto.nombre} · ${formatearFecha(gasto.fecha_gasto)}</div>
      </div>
      <div class="tx-amounts">
        <div class="tx-total">$${monto}</div>
        <div class="tx-each">${gasto.metodo_pago || ""}</div>
      </div>
      <div>
        <button class="btn-editar has-text-grey is-size-7" style="background:none;border:none;cursor:pointer;">Editar</button>
        <button class="btn-borrar has-text-grey is-size-7" style="background:none;border:none;cursor:pointer;">Borrar</button>
      </div>
    `;

    fila.querySelector(".btn-editar").addEventListener("click", () => activarEdicion(fila, gasto));
    fila.querySelector(".btn-borrar").addEventListener("click", () => borrarGasto(gasto.id_gasto));

    contenedor.appendChild(fila);
  });
}

function activarEdicion(fila, gasto) {
  fila.innerHTML = `
    <span class="tx-dot" style="background:#999"></span>
    <div class="tx-info" style="display:flex; flex-direction:column; gap:0.4rem;">
      <input class="input is-small" id="edit-descripcion" value="${gasto.descripcion}" style="border-radius:8px;">
      <input class="input is-small" id="edit-monto" type="number" value="${gasto.monto}" style="border-radius:8px;">
    </div>
    <div class="tx-amounts" style="display:flex; flex-direction:column; gap:0.4rem;">
      <select class="select is-small" id="edit-categoria" style="border-radius:8px;"></select>
      <select class="select is-small" id="edit-metodo" style="border-radius:8px;"></select>
    </div>
    <div style="display:flex; flex-direction:column; gap:0.3rem;">
      <button class="button is-small is-success" id="btn-guardar" style="border-radius:8px;">Guardar</button>
      <button class="button is-small is-light" id="btn-cancelar" style="border-radius:8px;">Cancelar</button>
    </div>
  `;

  fetch(`${URL_API}/nombre-categoria`)
    .then(r => r.json())
    .then(cats => {
      const sel = fila.querySelector("#edit-categoria");
      sel.innerHTML = cats.map(c =>
        `<option value="${c.id_categoria}" ${c.id_categoria === gasto.categoria ? "selected" : ""}>${c.nombre}</option>`
      ).join("");
    });

  fetch(`${URL_API}/metodo-pago`)
    .then(r => r.json())
    .then(metodos => {
      const sel = fila.querySelector("#edit-metodo");
      metodos.forEach(m => {
        const op = document.createElement("option");
        op.value = m.id;
        op.textContent = m.nombre;
        if (m.id === gasto.metodo_pago) op.selected = true;
        sel.appendChild(op);
      });
    });

  fila.querySelector("#btn-guardar").addEventListener("click", async () => {
    const data = {
      descripcion: fila.querySelector("#edit-descripcion").value,
      monto: parseFloat(fila.querySelector("#edit-monto").value),
      categoria: parseInt(fila.querySelector("#edit-categoria").value),
      metodo_pago: parseInt(fila.querySelector("#edit-metodo").value),
    };
    try {
      const respuesta = await fetch(`${URL_API}/${gasto.id_gasto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!respuesta.ok) throw new Error("Error al guardar");
      alert("¡Gasto actualizado!");
      location.reload()
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar");
    }
  });

  fila.querySelector("#btn-cancelar").addEventListener("click", () => obtenerGastos());
}

async function borrarGasto(id) {
  try {
    const respuesta = await fetch(`${URL_API}/${id}`, { method: "DELETE" });
    if (!respuesta.ok) throw new Error("Error al borrar");
    alert("¡Borrado con éxito!");
    location.reload()
  } catch (error) {
    console.error("No se pudo borrar el gasto:", error);
    alert("Hubo un error al borrar el gasto");
  }
}

async function obtenerGastoMes() {
  try {
    const respuesta = await fetch(`${URL_API}/total-mes`);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const gasto = await respuesta.json();
    mostrarGastoDelMes(gasto.total);
  } catch (error) {
    console.error("No se pudieron cargar los gastos:", error);
  }
}

function mostrarGastoDelMes(gasto) {
  const contenedor = document.getElementById("gasto-mes");
  contenedor.textContent = gasto != null ? `$${gasto}` : `$0`;
}

async function obtenerGastoMesUsuario() {
  try {
    const respuesta = await fetch(`${URL_API}/total-mes/usuario/${getUsuarioActual().id_user}`);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const gasto = await respuesta.json();
    mostrarGastoDelMesUsuario(gasto.total);
  } catch (error) {
    console.error("No se pudieron cargar los gastos:", error);
  }
}

function mostrarGastoDelMesUsuario(gasto) {
  const contenedor = document.getElementById("gasto-user");
  contenedor.textContent = gasto != null ? `$${gasto}` : `$0`;
}

const coloresCategorias = ['#00bfa5', '#7c4dff', '#f5a623', '#00d4d4', '#ff6b35'];

async function obtenerGastosPorCategoria() {
  try {
    const respuesta = await fetch(`${URL_API}/categoria`);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
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

  const contenedorLeyenda = document.querySelector('.legend');

  if (categorias.length === 0) {
    contenedorLeyenda.innerHTML = "<p>No hay registros de gastos</p>";
    return;
  }

  const chartExistente = Chart.getChart('donut');
  if (chartExistente) {
    chartExistente.data.labels = etiquetas;
    chartExistente.data.datasets[0].data = valores;
    chartExistente.data.datasets[0].backgroundColor = colores;
    chartExistente.update();
  } else {
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
  }

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

async function obtenerGastosPorMes() {
  try {
    const respuesta = await fetch(`${URL_API}/por-mes`);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const datos = await respuesta.json();
    mostrarGraficoBarras(datos);
  } catch (error) {
    console.error("No se pudieron cargar los gastos por mes:", error);
  }
}

function mostrarGraficoBarras(datos) {
  const etiquetas = datos.map(d => `${nombresMeses[parseInt(d.mes) - 1]} ${d.anio}`);
  const valores = datos.map(d => parseFloat(d.total));

  const chartExistente = Chart.getChart('barras');
  if (chartExistente) {
    chartExistente.data.labels = etiquetas;
    chartExistente.data.datasets[0].data = valores;
    chartExistente.update();
  } else {
    new Chart(document.getElementById('barras'), {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Gastos por mes',
          data: valores,
          backgroundColor: '#5b9cf6',
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 40,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: value => `$${value}` }
          }
        }
      }
    });
  }
}

async function obtenerGastosUsuarioPorMes() {
  try {
    const respuesta = await fetch(`${URL_API}/usuario/${ID_USER}/gastos-por-mes`);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const datos = await respuesta.json();
    mostrarGraficoLinea(datos);
  } catch (error) {
    console.error("No se pudieron cargar los gastos por mes:", error);
  }
}

function mostrarGraficoLinea(datos) {
  const etiquetas = datos.map(d => {
    const fecha = new Date(d.mes);
    return nombresMeses[fecha.getMonth()];
  });
  const valores = datos.map(d => parseFloat(d.total));

  const chartExistente = Chart.getChart('lineChart');
  if (chartExistente) {
    chartExistente.data.labels = etiquetas;
    chartExistente.data.datasets[0].data = valores;
    chartExistente.update();
  } else {
    new Chart(document.getElementById('lineChart'), {
      type: 'line',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Gastos mensuales',
          data: valores,
          borderColor: '#00bfa5',
          backgroundColor: 'rgba(0, 191, 165, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: value => `$${value}` }
          }
        }
      }
    });
  }
}

function inicializar() {
  obtenerGastosPorMes();
  obtenerGastosPorCategoria();
  obtenerGastos();
  obtenerGastoMes();
  obtenerGastoMesUsuario();
  obtenerGastosUsuarioPorMes();
}

inicializar();