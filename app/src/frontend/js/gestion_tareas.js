
const URL_API = `${window.location.origin}/api/v1/tareas`;
const coloresPorCategoria = {
    1: '#00bfa5', // Limpieza
    2: '#f5a623', // Cocina
    3: '#7c4dff', // Mantenimiento
    4: '#00d4d4', // Jardinería
    5: '#ff6b6b', // Mascotas
    6: '#4ecdc4', // Compras
};


async function init() {

    await obtenerCategorias();
    await cargarTareas();
    registrarHandlerFormulario();
    document.querySelector('[name="fecha_vencimiento"]').min = new Date().toISOString().substring(0,10) //
}
//CATEGORIAS

async function obtenerCategorias() {
    try {

        const res = await fetch(`${URL_API}/nombre-categoria-tarea`);
        if(!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const categorias = await res.json();
        mostrarCategoriasEnSelect(categorias);
    } catch (error) {
        console.error("Error al cargar categorías: ",error);
    }
}


function mostrarCategoriasEnSelect(categorias) {
    const select = document.getElementById("id_categoria");
    select.innerHTML = '';
    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.id_categoria;
        opcion.textContent = categoria.nombre;
        select.appendChild(opcion);
    });
}
//Listar tareas TABLA DE GESTIÓN
//Pido todas las tareas con información completa
async function cargarTareas() {
    try {
        const res = await fetch(`${URL_API}/completas`);
        if(!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        const tareas = await res.json();
        mostrarTareasEnLista(tareas);
    } catch (error) {
        console.error("Error al cargar tareas", error);
    }
}

//Recibe el arreglo o lista de tareas y armo la tabla completa dentro de #lista-tareas-gestion, una fila (t-eow) por tarea
function mostrarTareasEnLista(tareas) {
    const contenedor = document.getElementById('lista-tareas-gestion');
    contenedor.innerHTML=''; //Limpia la tabla antes de crear otra

//En el caso de que no hayan tareas se muestra este mensaje.
    if(tareas.length == 0) {
        const mensajeVacio = document.createElement('p');
        mensajeVacio.textContent = "No hay tareas registradas";
        mensajeVacio.className = 'has-text-grey has-text-centered';
        contenedor.appendChild(mensajeVacio);
        return;
    }
    //Por cada tarea armamos una fila con crearFila() (para modularizar un poco) y la agregamos al DOM
    tareas.forEach(tarea => {
        contenedor.appendChild(crearFila(tarea));
    });
}

//crearFila arma una fila div class "tx-row" a modo de vista, muestra los datos de la tarea, no un formulario de edición. Lo vamos a usar tanto para la lista por primera vez o cuando se cancele una edición

function crearFila(tarea) {
    const color = coloresPorCategoria[tarea.id_categoria] || '#999'; //Gris si no se asocia a ninguna categoría

    //Creamos el contenedor de la vida. 
    const fila = document.createElement('div');
    fila.className = 'tx-row';


    //Punto de color o dot que indica  la categoría
    const puntoCategoria = document.createElement('span');
    puntoCategoria.className = 'tx-dot';
    puntoCategoria.style.backgroundColor = color;

    //Contenedor donde irá el nombre de la tarea más la categoría, fecha y usuario asignado si es que tiene
    const infoTarea = document.createElement('div');
    infoTarea.className = 'tx-info';

    const nombreTarea = document.createElement('div');
    nombreTarea.className = 'tx-name';
    nombreTarea.textContent = tarea.descripcion;

    //tarea.usuario puede venir [null] si no tiene usuario asignado. Así que se filtra
    const usuarioAsignado = tarea.usuario || 'Sin asignar'; //?,[0] opcional chaining, si lo de la izq es null no tira error, devuelve undefined

    
    const metaTarea = document.createElement('div');
    metaTarea.className = 'tx-meta';
    metaTarea.textContent = `${tarea.categoria} · Vence ${formatearFecha(tarea.fecha_vencimiento)} · ${usuarioAsignado}`;
    
    //Agrego elementos 
    infoTarea.appendChild(nombreTarea);
    infoTarea.appendChild(metaTarea);

    //Parte de estado (pendiente / en progreso / hecha), con su color acorde
    const estadoTarea = document.createElement('span');
    estadoTarea.className = `badge-estado ${obtenerClasesSegunEstado(tarea.estado)}`;
    estadoTarea.textContent = ponerPrimeraLetraMayuscula(tarea.estado); 


    //Columna de botones de acción: Editar y Eliminar
    const acciones = document.createElement('div');
    acciones.className = 'edit-acciones';

    const botonEditar = document.createElement('button');
    botonEditar.className = 'btn-hecha'; //Reusamos el estilo que ya existe
    botonEditar.textContent = 'Editar';
    //Al hacer click transforma ESTA FILA en un formulario de edición
    botonEditar.addEventListener("click", () => activarModoedicion(fila,tarea));


    const botonEliminar = document.createElement('button');
    botonEliminar.className = 'btn-hecha';
    botonEliminar.textContent = 'Eliminar'
    //Al hacer click elimina la tarea (obvio)
    botonEliminar.addEventListener("click",() => eliminarTarea(tarea.id_tarea));

    acciones.appendChild(botonEditar);
    acciones.appendChild(botonEliminar);


    //Armamos la fila completa en orden: punto, info, estado, acciones
    fila.appendChild(puntoCategoria);
    fila.appendChild(infoTarea);
    fila.appendChild(estadoTarea);
    fila.appendChild(acciones);

    return fila;
}


//EDICION INLINE
/*

La fila se vacía y se reemplaza por un mini formulario

*/


//Vacía la fila actual y pone el formulario de edición
async function activarModoedicion(fila,tarea) {
    fila.innerHTML='';
    const form = await construirFormularioEdicion(fila, tarea);
    fila.appendChild(form);


}


//Se arma un formulario de edicion con 3 columnas: 
/*
- descripción y notas
- categoria (select y fecha de vencimiento)
- botones guardar / cancelar
*/
async function construirFormularioEdicion(fila,tarea) {
    const form = document.createElement('div');
    form.className = 'edit-form';

    //columna izquierda: descripcion y notas
    const editInfo = document.createElement('div');
    editInfo.className = 'edit-info';

    //Creo el input
    const inputDescripcion = document.createElement('input');
    inputDescripcion.className = 'input is-small';
    inputDescripcion.type = 'text';
    inputDescripcion.value = tarea.descripcion ; //Precarga el valor actual

    const inputNotas = document.createElement('input');
    inputNotas.className = 'input is-small';
    inputNotas.type = 'text';
    inputNotas.placeholder = 'Notas';
    inputNotas.value = tarea.notas || ''; //Notas es opcional así que puede venir NULL

    editInfo.appendChild(inputDescripcion);
    editInfo.appendChild(inputNotas);

    //Columna del medio: categoria y fecha
    const editDatos = document.createElement('div');
    editDatos.className = 'edit-datos';

    //Primero empezamos con las categorías
    const selectCategoria = document.createElement('select');

    //Pedimos categorias a la API
    try {
        const res = await fetch(`${URL_API}/nombre-categoria-tarea`);
        if(!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const categorias = await res.json();
        
        categorias.forEach(categoria => {
            const opcion = document.createElement('option');
            opcion.value = categoria.id_categoria;
            opcion.textContent = categoria.nombre;
            if (categoria.id_categoria == tarea.id_categoria) opcion.selected = true;
            selectCategoria.appendChild(opcion);
        });
    } catch (error) {
        console.error("Error al carar categorías para edición",error);
    } 

    //Ahora la fecha
    const inputFecha = document.createElement('input');
    inputFecha.className = 'input is-small';
    inputFecha.type = 'date';
    inputFecha.value = formatoInputFecha(tarea.fecha_vencimiento);
    inputFecha.min = new Date().toISOString().substring(0,10); //Establece mínimo para que no se pueda poner fecha pasada a día actual
    
    //Agregamos al elemento
    editDatos.appendChild(selectCategoria);
    editDatos.appendChild(inputFecha);


    //Columna derecha: botones de acciones
    const editAcciones = document.createElement('div');
    editAcciones.className = 'edit-acciones';

    const botonGuardar = document.createElement('button');
    botonGuardar.className = 'btn-elegir';
    botonGuardar.textContent = 'Guardar';
    botonGuardar.addEventListener('click', () => {
        //Armamos objeto con los valores actuales del form como los espera el endpoint PUT /:id
        const tareaEditada = {
            descripcion: inputDescripcion.value,
            notas: inputNotas.value,
            id_categoria : selectCategoria.value,
            fecha_vencimiento : inputFecha.value || null 
        };
        guardarEdicion(tarea.id_tarea,tareaEditada); //Guardamos
        
    });
        
    const botonCancelar = document.createElement('button');
    botonCancelar.className = 'btn-hecha';
    botonCancelar.textContent = 'Cancelar';
    // Al cancelar, descartamos los cambios y volvemos a mostrar la fila original
    botonCancelar.addEventListener('click', () => cancelarEdicion(fila, tarea));

    editAcciones.appendChild(botonGuardar);
    editAcciones.appendChild(botonCancelar);

    //Armamos las 3 columnas dentro del formulario
    form.appendChild(editInfo);
    form.appendChild(editDatos);
    form.appendChild(editAcciones);

    return form;
    }


    //Funcion para cancelar la edición, reconstruye la fila desde cero con los datos originales de la tarea. No solo en el html.
    function cancelarEdicion(fila,tarea) {
        const filaOriginal = crearFila(tarea);
        fila.replaceWith(filaOriginal); //replaceWith es funcion de js vanilla, se usa para intercambiar valores directamente
    }

    //GUARDAR CAMBIOS
    //Manda el put al back con los datos editados, si sale bien se recarga la página para reflejar el cambio.
async function guardarEdicion(idTarea, tareaEditada) {
    try {
        const res = await fetch(`${URL_API}/${idTarea}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tareaEditada)
        });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        await cargarTareas(); // refresca la tabla completa con los datos actualizados
        mostrarToast('Tarea editada exitosamente');
    } catch (error) {
        mostrarToast('Error al editar tarea', 'error'); //Notifcación caso fallido
        console.error("Error al guardar edición", error);
    }
}

//ELIMINAR TAREA
//Pide confirmación antes de borrar para evitar eliminar por accidente, llama al endpoint DELETE    /:id

async function eliminarTarea(idTarea) {
    const confirmar = confirm('¿Seguro que querés eliminar esta tarea?');
    if (!confirmar) return; // el usuario canceló, no se hace nada

    try {
        const res = await fetch(`${URL_API}/${idTarea}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        await cargarTareas(); // refresca la tabla sin la tarea eliminada
        mostrarToast('Tarea eliminada exitosamente');
    } catch (error) {
        console.error("Error al eliminar tarea", error);
        mostrarToast('Error al eliminar tarea', 'error');
    }
}


//CREAR TAREA   
/* Con el evento submit del formulario #form-crear-tarea, se llama una sola vezdesde el init */
function registrarHandlerFormulario() {
    const form = document.getElementById('form-crear-tarea');

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault(); // para evitar que la página se recargue 

        // FormData lee los inputs por su atributo "name", así que tienen
        // que coincidir con los nombres usados en el HTML
        const datos = new FormData(form);
        const nuevaTarea = {
            descripcion: datos.get('descripcion'), 
            id_categoria: datos.get('id_categoria'),
            fecha_vencimiento: datos.get('fecha_vencimiento') || null, // opcional
            notas: datos.get('notas'),
        };

        try {
            const res = await fetch(URL_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaTarea)
            });
            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

            form.reset();   // limpia el formulario tras crear con éxito
            await cargarTareas();  // muestra la nueva tarea en la tabla
            alert("Tarea creada exitosamente")
            //mostrarToast('Tarea creada exitosamente');       //función para mostrar exito de la acción

        } catch (error) {
            console.error("Error al crear tarea", error);
        }
    });
}

//HELPERS

//Convierte fecha ISO a formatoLegible
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'Sin fecha límite';
    const [anio, mes, dia] = fechaISO.substring(0, 10).split('-');
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}
//Ahora para el input (mejora visual)
function formatoInputFecha(fechaISO) {
    if (!fechaISO) return '';
    return fechaISO.substring(0, 10);
}
//Devuelve la clase css del badge segun el estao de la tarea
function obtenerClasesSegunEstado(estado) {
if (estado === 'pendiente') return 'badge-pendiente';
    if (estado === 'en progreso') return 'badge-en-progreso';
    if (estado === 'hecha') return 'badge-hecha';
    return ''; // estado desconocido, sin color especial    
}
// Pone en mayúscula la primera letra
// para mostrar el estado de forma más prolija en el badge
function ponerPrimeraLetraMayuscula(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
//Función para mostrar acción exitosa o fallida
function mostrarToast(mensaje, tipo='exito') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast ${tipo}`; 
    setTimeout(()=>toast.classList.add('show'),10);
    setTimeout(() => toast.classList.remove('show'), 3000);
}

init();