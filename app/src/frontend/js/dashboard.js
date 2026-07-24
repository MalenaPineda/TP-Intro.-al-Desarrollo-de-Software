
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
    actualizarTarjetas();
    inicializarInteraccionTareas();

    cargarGastos();
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
    
    const fechaFormateadaEspaniol = hoy.toLocaleDateString('es-ES', opcionesFecha);
    
    if (elementoFecha && elementoCasa) {
        const nombreCasa = elementoCasa.textContent;
        if (!nombreCasa.includes('·')) {
            elementoCasa.textContent = `${fechaFormateadaEspaniol} · ${nombreCasa}`;
        }
        
        elementoFecha.style.display = 'none'; 
    }
} 
   
function actualizarTarjetas() {
    
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
        boton.addEventListener('click', function() {
            
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

const ENDPOINT_GASTOS = 'http://localhost:8000/api/v1/gastos'; 

async function cargarGastos() {
    try {
        const respuesta = await fetch('http://localhost:8000/api/v1/gastos');
        
        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los datos de los gastos');
        }
        const datosGastos = await respuesta.json();
        mostrarTransacciones(datosGastos);
    }
    catch (error) {
        console.error("Hubo un error de conexión: ", error);
        document.getElementById('lista-gastos').innerHTML = '<p style="color: red; font-size: 0.8rem;">Error al cargar los gastos.</p>';
    }
}
function mostrarTransacciones(gastos) {
    const contenedor = document.getElementById('lista-gastos');
    contenedor.innerHTML = '';
    gastos.forEach((gasto) => {
        const color = coloresPorCategoria[gasto.categoria] || "#999";
        const monto = parseFloat(gasto.monto).toFixed(2);

        const fila = document.createElement("div");
        fila.className = "tx-row";
        fila.innerHTML = `
            <span class="tx-dot" style="background:${color}"></span>
            <div class="tx-info">
                <div class="tx-descripcion">${gasto.descripcion}</div>
                <div class="tx-nombre">${gasto.nombre} · ${formatearFecha(gasto.fecha_gasto)}</div>
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
        const respuesta = await fetch("http://localhost:8000/api/v1/gastos/total-mes");
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const total = await respuesta.json();
        const el = document.getElementById("gasto-mes");
        if (el) el.textContent = `$${total}`;
    } catch (error) {
        console.error("No se pudo cargar el gasto del mes:", error);
    }
}

async function obtenerGastoMesUsuario() {
    try {
        const respuesta = await fetch("http://localhost:8000/api/v1/gastos");
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        const gasto = await respuesta.json();
        const el = document.getElementById("gasto-user");
        if (el) el.textContent = `$${gasto.total}`;
    } catch (error) {
        console.error("No se pudo cargar el gasto del usuario:", error);
    }
}