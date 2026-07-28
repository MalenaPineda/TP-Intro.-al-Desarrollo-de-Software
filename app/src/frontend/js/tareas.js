const URL_API = 'http://localhost:8000/api/v1/tareas';

const ID_USER = 3;

const coloresPorCategoria = {
    1: '#00bfa5', // Limpieza
    2: '#f5a623', // Cocina
    3: '#7c4dff', // Mantenimiento
    4: '#00d4d4', // Jardinería
    5: '#ff6b6b', // Mascotas
    6: '#4ecdc4', // Compras
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
        infoTarea.textContent = `${tarea.categoria} · Vence ${formatearFecha(tarea.fecha_vencimiento)}`;

        //badge - muestra el estado de la tarea con color según infoTarea_clase()
        const estadoTarea = document.createElement('span');
        estadoTarea.className = `badge-estado ${infoTarea_clase(tarea.estado)}`;
        estadoTarea.textContent = ponerPrimeraLetraMayuscula(tarea.estado);

        //boton - al clickear marca la tarea como hecha
       /* const boton = document.createElement('button');
        boton.className = 'btn-hecha';
        boton.textContent = 'Marcar como hecha';
        boton.addEventListener('click', () => {marcarHecha(tarea.id_tarea)});   */

        //boton- al clickear elige la tarea
        const botonElegir = document.createElement('button');
        botonElegir.className = 'btn-elegir';
        botonElegir.textContent = 'Elegir tarea';
        botonElegir.addEventListener('click', () => {elegirTarea(tarea.id_tarea)});


        card.appendChild(puntoCategoria);
        card.appendChild(tituloTarea);
        card.appendChild(infoTarea);
        card.appendChild(estadoTarea);
        //card.appendChild(boton);
        card.appendChild(botonElegir);
        contenedor.append(card)
    }
)
}

//MIS TAREAS

async function cargarMisTareas() {
    try {
        const res = await fetch(`${URL_API}/mias/${ID_USER}`);
        if (!res.ok) throw new Error(`Error HTTp: ${res.status}`);
        const tareas = await res.json();
        mostrarMisTareas(tareas);
    }
    catch (error) {
        console.error("Error al cargar mis tareas",error);
    }
}

function mostrarMisTareas(tareas) {
    const contenedor = document.getElementById('lista-mias');
    contenedor.innerHTML='';

    tareas.forEach(tarea => {
        const color = coloresPorCategoria[tarea.id_categoria] || '#999';
        const card = document.createElement('div');
        card.className = 'task-card';


        const puntoCategoria = document.createElement('span');
        puntoCategoria.className = 'tx-dot';
        puntoCategoria.style.backgroundColor = color;


        const tituloTarea = document.createElement('div');
        tituloTarea.className = 'task-title';
        tituloTarea.textContent = tarea.descripcion;

        const infoTarea = document.createElement('div');
        infoTarea.className = 'task-meta';
        infoTarea.textContent = `${tarea.categoria} · Vence ${formatearFecha(tarea.fecha_vencimiento)}`;

        const estadoTarea = document.createElement('span');
        estadoTarea.className = `badge-estado ${infoTarea_clase(tarea.estado)}`;
        estadoTarea.textContent = ponerPrimeraLetraMayuscula(tarea.estado);

      

        card.appendChild(puntoCategoria);
        card.appendChild(tituloTarea);
        card.appendChild(infoTarea);
        card.appendChild(estadoTarea);
        if (tarea.estado !== 'hecha') {

            const boton = document.createElement('button');
            boton.className = 'btn-hecha';
            boton.textContent = 'Marcar como hecha';
            boton.addEventListener('click', () => marcarHecha(tarea.id_tarea));
            card.appendChild(boton);
        }        
        contenedor.appendChild(card);

        
    });
}

async function cargarTareasDeOtros() {
    try {
        const res = await fetch(`${URL_API}/otros/${ID_USER}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const tareas = await res.json();
        mostrarTareasDeOtros(tareas);
    } catch (error) {
        console.error("Error al cargar tareas de otros",error);
    }
}

function mostrarTareasDeOtros(tareas)
 {
    const contenedor = document.getElementById('lista-otros'); 
    contenedor.innerHTML='';
    
    tareas.forEach(tarea => {

        const color = coloresPorCategoria[tarea.id_categoria] || '#999';
        const card = document.createElement('div');
        card.className = 'task-card';

        const puntoCategoria = document.createElement('span');
        puntoCategoria.className = 'tx-dot';
        puntoCategoria.style.backgroundColor = color;

        const tituloTarea = document.createElement('div');
        tituloTarea.className = 'task-title';
        tituloTarea.textContent = tarea.descripcion;

        const infoTarea = document.createElement('div');
        infoTarea.className = 'task-meta';
        infoTarea.textContent  = `${tarea.categoria} · Vence ${formatearFecha(tarea.fecha_vencimiento)}`;

        const estadoTarea = document.createElement('span');
        estadoTarea.className = `badge-estado ${infoTarea_clase(tarea.estado)}`;
        estadoTarea.textContent = ponerPrimeraLetraMayuscula(tarea.estado);

        const nombreUsuario = document.createElement('div');
        nombreUsuario.className = 'task-meta';
        nombreUsuario.textContent = tarea.usuario;
        
        //Configurado específicamente para esta columna. Se modifica el diseño para que el usuario y el estado de la tarea estén en la misma línea
        const footerCard = document.createElement('div');
        footerCard.className = 'card-footer';
        footerCard.appendChild(nombreUsuario);
        footerCard.appendChild(estadoTarea);

        card.appendChild(puntoCategoria);
        card.appendChild(tituloTarea);
        card.appendChild(infoTarea);
        card.appendChild(footerCard);
        contenedor.appendChild(card);
    });
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

//Para poner la primera letra mayúscula en los outout de los queries 
function ponerPrimeraLetraMayuscula(str) {
    if(!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
init();
