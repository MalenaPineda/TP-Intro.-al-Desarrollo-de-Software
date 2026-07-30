const URL_API = "http://localhost:8000/api/v1/gastos";
const URL_TAREAS = "http://localhost:8000/api/v1/tareas";

const coloresPorCategoria = {
    1: "#00bfa5",
    2: "#00d4d4",
    3: "#7c4dff",
    4: "#f5a623",
    5: "#ff6b35",
};


document.addEventListener("DOMContentLoaded", () => {
    mostrarFecha();
    cargarTareas();
    obtenerMisTareas();
    cargarGastosRecientes();
    obtenerGastoMes();
    obtenerGastoMesUsuario();

});

function mostrarFecha() {
    const elementoFecha = document.getElementById('current-date');
    const elementoCasa = document.getElementById('house-name');
    const hoy = new Date();
    const opcionesFecha = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    const fechaFormateadaEspaniol = hoy.toLocaleDateString('es-AR', opcionesFecha);
    if (elementoFecha && elementoCasa) {

        const nombreCasa = elementoCasa.textContent;
        if (!nombreCasa.includes('·')) {
            elementoCasa.textContent = `${fechaFormateadaEspaniol} · ${nombreCasa}`;
        }
        elementoFecha.style.display = 'none';
    }
}
function formatearFecha(fecha) {
    const fechaConvertida = new Date(fecha);

    return fechaConvertida.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

async function cargarTareas() {
    try {
        const respuesta = await fetch(`${URL_TAREAS}/completas`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener tareas");
        }

        const tareas = await respuesta.json();

        mostrarTareas(tareas);

        actualizarCantidadTareas(tareas);

        actualizarMisTareas(tareas);

    } catch (error) {
        console.error("Error cargando tareas:", error);
    }
}


function mostrarTareas(tareas) {

    const lista = document.getElementById("lista-tareas");
    if (!lista) return;
    lista.innerHTML = "";
    tareas.slice(0, 5).forEach(tarea => {

        let estadoClase = "";

        if (tarea.estado === "hecha") {
            estadoClase = "badge-hecha";
        }
        else if (tarea.estado === "en progreso") {
            estadoClase = "badge-en-progreso";
        }
        else {
            estadoClase = "badge-pendiente";
        }


        lista.innerHTML += `
        <div class="tx-row" 
        style="background: var(--bg); padding: 0.8rem; border-radius: 8px; border:none; margin-bottom:0.5rem;">

            <div class="tx-info">
                <div class="tx-name">
                    ${tarea.descripcion}
                </div>

                <div class="tx-meta">
                    ${tarea.usuario ?? "Sin asignar"}
                </div>
            </div>

            <div>
                <span class="badge-estado ${estadoClase}">
                    ${tarea.estado}
                </span>
            </div>
            <div>
                    <button class="btn-hecha" onclick="cambiarEstadoDashboard(${tarea.id_tarea}, 'en progreso')">
                        En progreso
                </button>

                <button class="btn-hecha" onclick="cambiarEstadoDashboard(${tarea.id_tarea}, 'hecha')">
                    Hecha
                </button>
            </div>
        </div>
        `;
    });
}

function actualizarCantidadTareas(tareas) {

    const pendientes = tareas.filter(
        tarea => tarea.estado !== "hecha"
    );

    const elemento = document.getElementById("pending-tasks");

    if (elemento) {
        elemento.textContent = pendientes.length;
    }
}

function actualizarMisTareas(tareas) {

    const misTareas = tareas.filter(
        tarea => tarea.usuario === "Malena"
    );

    const elemento = document.getElementById("my-tasks");

    if (elemento) {
        elemento.textContent = misTareas.length;
    }
}
async function cambiarEstadoDashboard(id, estado) {
    try {
        const respuesta = await fetch(`${URL_TAREAS}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                estado: estado
            })
        });

        if (!respuesta.ok) {
            throw new Error("Error cambiando estado");
        }
        await cargarTareas();
    } catch (error) {
        console.error(error);
    }
}
async function obtenerMisTareas() {
    try {
        const respuesta = await fetch(`${URL_TAREAS}/mias/3`);
        const tareas = await respuesta.json();
        const elemento = document.getElementById("my-tasks");

        if (elemento) {
            elemento.textContent = tareas.length;
        }
    } catch (error) {
        console.error("Error mis tareas", error);
    }
}

async function cargarGastosRecientes() {
    try {
        const respuesta = await fetch(URL_API);
        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los datos de los gastos');
        }
        const datosGastos = await respuesta.json();

        console.log(datosGastos);

        mostrarInformacionGastos(datosGastos);
    }
    catch (error) {
        console.error("Hubo un error de conexión: ", error);
    }
}

async function obtenerGastoMes() {
    try {
        const respuesta = await fetch(`${URL_API}/total-mes`);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const gasto = await respuesta.json();

        const elemento = document.getElementById("gasto-mes");
        if (elemento) {
            if (gasto.total !== null) {
                elemento.textContent = new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS'
                }).format(Number(gasto.total));
            } else {
                elemento.textContent = "$0.00";
            }
        }

    }
    catch (error) {
        console.error("No se pudo cargar el gasto del mes:", error);
    }
}

async function obtenerGastoMesUsuario() {
    try {
        const gastosMes = await fetch(`${URL_API}/total-mes`);
        const miembros = await fetch(`${URL_API}/miembros`);

        const gasto = await gastosMes.json();
        const cantidad = await miembros.json();

        const parte = Number(gasto.total) / Number(cantidad.cantidad);

        const elemento = document.getElementById("gasto-user");

        if (elemento) {
            elemento.textContent = new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS'
            }).format(Number(parte));
        }

    } catch (error) {
        console.error("No se pudo cargar el gasto del usuario:", error);
    }
}

function mostrarInformacionGastos(datosGastos) {
    const contenedor = document.getElementById('lista-gastos');
    contenedor.innerHTML = '';
    datosGastos.forEach((gasto) => {
        const color = coloresPorCategoria[gasto.categoria] || "#999";
        const monto = parseFloat(gasto.monto).toFixed(2);
        const fila = document.createElement("div");
        fila.className = "tx-row";
        fila.innerHTML = `
            <span class="tx-dot" style="background:${color}"></span>
            <div class="tx-info">
                <div class="tx-name">${gasto.descripcion}</div>
                <div class="tx-meta">${gasto.nombre} · ${formatearFecha(gasto.fecha_gasto)}</div>
            </div>
            <div class="tx-amounts">
                <div class="tx-total">$${monto}</div>
                <div class="tx-each">${gasto.metodo_pago}</div>
            </div>
        `;
        contenedor.appendChild(fila);
    });
}
