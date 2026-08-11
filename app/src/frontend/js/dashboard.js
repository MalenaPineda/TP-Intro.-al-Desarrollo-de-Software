const URL_API = `${window.location.origin}/api/v1/gastos`;
const URL_API_TAREAS = `${window.location.origin}/api/v1/tareas`;


const coloresPorCategoria = {
    1: "#00bfa5",
    2: "#00d4d4",
    3: "#7c4dff",
    4: "#f5a623",
    5: "#ff6b35",
};




document.addEventListener("DOMContentLoaded", () => {
    mostrarFecha();
    cargarTareasDashboard();
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
/*function actualizarTarjetasTareas() {
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
}

    document.getElementById('pending-tasks').textContent = tareasPendientes;
    document.getElementById('my-tasks').textContent = `${misTareasHechas} de ${misTareasTotales}`;
}*/

//Agrego función con endpoints corresponedientes a tareas
async function cargarTareasDashboard() {
    try {
        const [tareasCompletas, misTareas] = await Promise.all([
            fetch(`${URL_API_TAREAS}/completas`),
            fetch(`${URL_API_TAREAS}/mias/${getUsuarioActual().id_user}`)
        ]);
        if (!tareasCompletas.ok || !misTareas.ok) {
            throw new Error(`Error HTTP: ${tareasCompletas.status} / ${misTareas.status}`);
        }

        const tareas = await tareasCompletas.json();
        const misTareasArreglo = await misTareas.json();

        const pendientes = tareas.filter(t => t.estado !== "hecha").length //Para contar tareas pendientes de los demás
        document.getElementById('pending-tasks').textContent = pendientes;

        const hechas = misTareasArreglo.filter(t => t.estado === "hecha").length //Para contar mis tareas pendientes
        document.getElementById('my-tasks').textContent = `${hechas} de ${misTareasArreglo.length}`;

        renderizarTareasAsignadas(misTareasArreglo);
        mostrarProximasAVencer(tareas);
    } catch (error) {
        console.error("Error al cargar tareas del dashboard", error);
    }
}

function renderizarTareasAsignadas(tareas) {
    const contenedor = document.getElementById('lista-tareas-asignadas');
    contenedor.innerHTML = '';

    if (tareas.length === 0) {
        contenedor.innerHTML = '<p class="has-text-grey"> No hay tareas registradas. </p> ';
        return;
    }
    tareas.forEach(tarea => {
        const fila = document.createElement('div');
        fila.className = 'tx-row';
        fila.style.cssText = 'background: var(--bg); padding: 0.8rem; border-radius: 8px; border: none; margin-bottom: 0.5rem;'

        const info = document.createElement('div');
        info.className = 'tx-info';

        const nombre = document.createElement('div');
        nombre.className = 'tx-name';
        nombre.textContent = tarea.descripcion;

        const meta = document.createElement('div');
        meta.className = 'tx-meta';
        meta.textContent = tarea.usuario || 'Sin asignar';

        info.appendChild(nombre);
        info.appendChild(meta);

        const badge = document.createElement('span');
        badge.className = `badge-estado ${clasesSegunEstado(tarea.estado)}`;
        badge.textContent = etiquetaEstado(tarea.estado);
        badge.dataset.idTarea = tarea.id_tarea;
        badge.dataset.estado = tarea.estado;

        const estadoVencimiento = crearAvisoVencimiento(tarea);

        fila.appendChild(info);
        fila.appendChild(badge);
        if(estadoVencimiento) { fila.appendChild(estadoVencimiento)}
        contenedor.appendChild(fila);

    });
}

//Muestra las tareas que están vencidas o vencen dentro de 3 días o menos
//Se muestran ordenados por fecha de vencimiento
function mostrarProximasAVencer(tareas) {
    const contenedor = document.getElementById('lista-proximas-a-vencer');
    if(!contenedor) {
        return;
    }

    contenedor.innerHTML= '';

    //Filtramos las tareas NO hechas que estén por vencer
    const proximas = tareas
    .filter(tarea => tarea.estado !== 'hecha' && infoVencimiento(tarea.fecha_vencimiento))
    .sort((a,b) => (a.fecha_vencimiento || '').localeCompare(b.fecha_vencimiento || ''));

    //Si no hay nada vencido o por vencer, se muestra mensaje correspondiente
    if(proximas.length === 0) {
        contenedor.innerHTML = '<p class="has-text-grey">No hay tareas por vencer.</p>';
        return;
    }

    proximas.forEach(tarea=> {
        const info = infoVencimiento(tarea.fecha_vencimiento);

        const fila = document.createElement('div');
        fila.className = "tx-row";
        fila.style.cssText = 'background: var(--bg); padding: 0.8rem; border-radius: 8px; border: none; margin-bottom: 0.5rem;'; 
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'tx-info';

        const nombre = document.createElement('div');
        nombre.className = 'tx-name';
        nombre.textContent = tarea.descripcion;

        const meta = document.createElement('div');
        meta.className = 'tx-meta';
        meta.textContent = `${tarea.categoria} · ${tarea.usuario || 'Sin asignar'}`;

        infoDiv.appendChild(nombre);
        infoDiv.appendChild(meta);

        const badge = document.createElement('span');
        badge.className = `badge-vencimiento ${info.tipo}`;
        badge.textContent = info.texto;

        fila.appendChild(infoDiv);
        fila.appendChild(badge);
        contenedor.appendChild(fila);        

    });

}
//Helpers para tareas
function clasesSegunEstado(estado) {
    if (estado === 'pendiente') return 'badge-pendiente';
    if (estado === 'en progreso') return 'badge-en-progreso';
    if (estado === 'hecha') return 'badge-hecha';
    return '';
}

function etiquetaEstado(estado) {
    if (estado === 'pendiente') return 'Pendiente';
    if (estado === 'en progreso') return 'En progreso';
    if (estado === 'hecha') return 'Hecha'
    return '';
}

function siguienteEstado(estado) {
    if (estado === 'pendiente') return 'en progreso';
    if (estado === 'en progreso') return 'hecha';
    return 'pendiente';
}


//Registra el click sobre los badges de estado
//Uso delegación de eventos en el contenedor: así funciona aunque la lista se re-renderice
function inicializarInteraccionTareas() {
    const contenedor = document.getElementById('lista-tareas-asignadas');
    if (!contenedor) return;

    contenedor.addEventListener('click', async (evento) => {
        //closest busca el badge más cercano al elemento clickeado (por si el click cae en un hijo)
        const badge = evento.target.closest('.badge-estado');
        if (!badge) return;

        //Leo la tarea y su estado actual desde los data-* del badge
        const idTarea = badge.dataset.idTarea;
        const nuevoEstado = siguienteEstado(badge.dataset.estado);

        //Bloqueo clicks mientras se guarda para evitar envíos duplicados
        badge.style.pointerEvents = 'none';

        try {
            //Persisto el nuevo estado en el backend
            const res = await fetch(`${URL_API_TAREAS}/${idTarea}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

            //Refresco contadores y lista con los datos actualizados
            await cargarTareasDashboard();
        } catch (error) {
            //Si falla, habilito el badge de nuevo para que el usuario pueda reintentar
            badge.style.pointerEvents = '';
            console.error("Error al cambiar estado de la tarea:", error);
        }
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