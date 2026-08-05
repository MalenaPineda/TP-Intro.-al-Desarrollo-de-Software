const URL_API = "http://localhost:8000/api/v1/gastos";

const coloresPorCategoria = {
    1: "#00bfa5",
    2: "#00d4d4",
    3: "#7c4dff",
    4: "#f5a623",
    5: "#ff6b35",
};


document.addEventListener("DOMContentLoaded", () => {
    mostrarFecha();
    actualizarTarjetasTareas();
    inicializarInteraccionTareas();
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
function actualizarTarjetasTareas() {
    const tareas = [
        { nombre: "Limpiar la cocina", asignado: "Alex", estado: "en progreso" },
        { nombre: "Sacar la basura", asignado: "Jordan", estado: "en progreso" },
        { nombre: "Hacer la compra", asignado: "You", estado: "pendiente" },
        { nombre: "Regar las plantas", asignado: "Sam", estado: "hecha" },
        { nombre: "Aspirar el salón", asignado: "You", estado: "en progreso" }
    ];
    const formateadorDinero = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    const tareasPendientes = tareas.filter(tarea => tarea.estado !== "hecha").length;
    const misTareasTotales = tareas.filter(tarea => tarea.asignado === "You").length;
    const misTareasHechas = tareas.filter(tarea => tarea.asignado === "You" && tarea.estado === "hecha").length;

    document.getElementById('pending-tasks').textContent = tareasPendientes;
    document.getElementById('my-tasks').textContent = `${misTareasHechas} de ${misTareasTotales}`;
}
function inicializarInteraccionTareas() {
    const botonesEstado = document.querySelectorAll('.badge-estado');
    botonesEstado.forEach(boton => {
        boton.addEventListener('click', function () {
            if (this.classList.contains('estado-pendiente')) {
                this.classList.remove('estado-pendiente');
                this.classList.add('estado-progreso');
                this.textContent = 'En progreso';
            }
            else if (this.classList.contains('estado-progreso')) {
                this.classList.remove('estado-progreso');
                this.classList.add('estado-hecha');
                this.textContent = 'Hecha';
            }
            else if (this.classList.contains('estado-hecha')) {
                this.classList.remove('estado-hecha');
                this.classList.add('estado-pendiente');
                this.textContent = 'Pendiente';
            }
            //  "fetch()" 
        });
    });

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

/*
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
    */
//función adaptada para que tenga en cuenta el usuario actual para mostrar gastos
async function obtenerGastoMesUsuario() {
    try {
        const idUser = getUsuarioActual().id_user;
        const respuesta = await fetch(`${URL_API}/total-mes/usuario/${idUser}`);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        const gasto = await respuesta.json();
        const elemento = document.getElementById("gasto-user");
        if (elemento) {
            elemento.textContent = new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS'
            }).format(Number(gasto.total ?? 0));
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
