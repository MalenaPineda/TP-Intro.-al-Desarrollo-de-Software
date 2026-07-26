//import { application } from "express";

const URL_API = 'http://localhost:8000/api/v1/tareas';
const ID_USER = 1;

const coloresPorCategoria = {
    1: '#00bfa5', // Limpieza
    2: '#f5a623', // Cocina
    3: '#7c4dff', // Compras
    4: '#00d4d4', // Mantenimiento
};

/*   Cargar página principal al iniciar */

async function init() {
    await cargarDisponibles();
    await cargarMisTareas();
    await cargarTareasDeOtros();
}

// Tareas disponibles

async function cargarDisponibles() {
    try {
        const res = await fetch(`${URL_API}/disponibles`);
        if(!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`); 
        } 
        const tareas = await res.json();
        mostrarDisponibles(tareas);
    } catch (error) {
        console.error("Error al cargar tareas disponibles", error);
    }

}

function mostrarDisponibles(tareas) {
    const contenedor = document.getElementById('lista-disponibles');
    contenedor.innerHTML='';

    tareas.forEach(tarea => {
        const color = coloresPorCategoria[tarea.id_categoria] || '#999';
        const card = document.createElement('div');
        card.className = ('task-card');

        //dot es el puntito de color que identifica la categoría de la tarea visualmente
        const puntoCategoria = document.createElement('span'); //dot
        puntoCategoria.className = 'tx-dot';
        puntoCategoria.style.backgroundColor = color;
        
        const tituloTarea = document.createElement('div');
        tituloTarea.className = 'task-title';
        tituloTarea.textContent = tarea.descripcion;

        const infoTarea = document.createElement('div'); //badge
        infoTarea.className = 'task-meta';
        infoTarea.textContent = `${tarea.categoria} Vence ${formatearFecha(tarea.fecha_vencimiento)}`;

        //badge - muestra el estao de la tarea con color según infoTarea_clase()
        const estadoTarea = document.createElement('span');
        estadoTarea.className = `badge-estado ${infoTarea_clase(tarea.estado)}`;
        estadoTarea.textContent = tarea.estado;


        //boton - al clickear marca la tarea como hecha
        const boton = document.createElement('button');
        boton.className = 'btn-hecha';
        boton.textContent = 'Marcar como hecha';
        boton.addEventListener('click', () => {marcarHecha(tarea.id_tarea)});
        
        //boton- al clickear elige la tarea
        const botonElegir = document.createElement('button');
        botonElegir.className = 'btn-elegir';
        botonElegir.textContent = 'Elegir tarea';
        botonElegir.addEventListener('click', () => {elegirTarea(tarea.id_tarea)});


        card.appendChild(puntoCategoria);
        card.appendChild(tituloTarea);
        card.appendChild(infoTarea);
        card.appendChild(estadoTarea);
        card.appendChild(boton);
        card.appendChild(botonElegir);
        contenedor.append(card)
    }
)
}


// ACCIONES

//Asigna la tarea al usuario actual - LLAMA A POST /tareas/:id/usuarios
//Después de asignar recarga toda la página con init()

async function elegirTarea(id_tarea) {
    try {
        const res = await fetch(`${URL_API}/${id_tarea}/usuarios`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id_user: ID_USER})  // manda el id del usuario en el body
        });
        if(!res.ok) {
            throw new Error('Error al elegir tarea');
        }
        await init();

    } catch (error) {
        console.error("Error al marcar tarea:", error);
    }
}

//CAMBIAR EL ESTADO DE LA TAREA A HECHA - llama a PATCH /tareas/:id
async function marcarHecha(id_tarea) {
    try {
        const res = await fetch(`${URL_API}/${id_tarea}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({estado: 'hecha'}) //manda el nuevo estado en el body
        });
        if (!res.ok) {
            throw new Error('Error al marcar tarea');
        } 
        await init(); //Recarga las 3 columnas
    } catch (error) {
        console.error("Error al marcar la tarea", error);
        }
}

//HELPERS 

//Convertir una fcha en formato ISO (aaaa-mm-ddT00:00:00.000z) a formato legible (25 jun)
function formatearFecha(fechaISO) {
    if(!fechaISO) return 'Sin fecha límite'; //Si no tiene fecha devuelve ese mensaje
    const fecha = new Date(fechaISO); //crea un objeto Date desde el string ISO
    return fecha.toLocaleDateString('es-AR', {day: 'numeric',month:'short'});
}


//Devolver clase CSS correcta según el estado de la tarea
// Esa clase define el color de infoTarea en style.css
function infoTarea_clase(estado) {
    if (estado == 'pendiente') {return 'badge-pendiente';}
    if (estado == 'en progreso') {return 'badge-en-progreso';}
    if(estado == 'hecha') {return 'badge-hecha';}
    return ''; //En el caso de que el estado no coincida con ninguno devuelve vacío
}

init();
