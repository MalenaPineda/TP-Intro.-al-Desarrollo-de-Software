const URL_API = 'http://localhost:8000/api/v1/usuarios';

// función auxiliar para establecer la fecha máxima en el input de fecha de nacimiento
function establecerFechaMaxima() {
    const fechaMaxima = new Date().toISOString().split('T')[0];

    const inputFecha = document.querySelector('input[name="fecha_nacimiento"]');

    if (inputFecha) {
        inputFecha.max = fechaMaxima;
    }
}

//Funcion auxiliar para cargar todo
async function init() {
    await cargarMiembros();
    registrarHandlerFormulario();
    establecerFechaMaxima();
}
//Para obtener ususarios activos del back
async function cargarMiembros() {
    try {
        const res = await fetch(URL_API);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const miembros = await res.json();
        mostrarMiembrosEnLista(miembros);
    } catch (error) {
        console.error("Error al cargar miembros", error);
    }
}

//Renderiza la tabla de miembros dentro del div #lista-miembros
function mostrarMiembrosEnLista(miembros) {
    const contenedor = document.getElementById('lista-miembros');
    contenedor.innerHTML = '';

    if (miembros.length === 0) {
        const mensajeVacio = document.createElement('p');
        mensajeVacio.textContent = "No hay miembros registrados";
        mensajeVacio.className = 'has-text-grey has-text-centered';
        contenedor.appendChild(mensajeVacio);
        return;
    }
    //Crea una fila por cada miembro usando el DOM
    miembros.forEach(miembro => {
        contenedor.appendChild(crearFila(miembro));
    });
}

//Crea un elemento div con la información de un miembro
function crearFila(miembro) {
    const fila = document.createElement('div');
    fila.className = 'tx-row';

    //Esta parte me ayudé con la IA para poder modelar el avatar adaptado a la tabla
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    //Ajustamos el tamaño a un tamaños más pequeño (la base es de 36px y lo ponemos en 32px)
    avatar.style.width = '32px';
    avatar.style.height = '32px';
    avatar.style.fontSize = '.75rem';
    avatar.textContent = miembro.nombre.charAt(0).toUpperCase(); //charAt(0) agarra el primer caracter y toUpperCase lo pone en maýuscula por si arranca en minúscula


    //Columna de información del usuario: nombre, email, fecha
    const info = document.createElement('div');
    info.className = 'tx-info';

    const nombre = document.createElement('div');
    nombre.className = 'tx-name';
    nombre.textContent = miembro.nombre;

    const meta = document.createElement('div');
    meta.className = 'tx-meta';
    // Si tiene fecha de nacimiento la muestra, sino solo el email
    //Sintaxis de esto es condicion ? valorSiTrue : valorSIFalse
    const fecha = miembro.fecha_nacimiento ? ` · Nacimiento ${formatearFecha(miembro.fecha_nacimiento)}` : '';
    meta.textContent = `${miembro.email}${fecha}`;

    info.appendChild(nombre);
    info.appendChild(meta);


    //Columba de ACCIONES EDITAR Y ELIMIANR
    const acciones = document.createElement('div');
    acciones.className = 'edit-acciones';
    //BOTON EDITAR
    const botonEditar = document.createElement('button');
    botonEditar.className = 'btn-hecha';
    botonEditar.textContent = 'Editar';
    // Activa el formulario de edición inline al hacer click
    botonEditar.addEventListener('click', () => activarModoEdicion(fila, miembro));

    //BOTON ELIMINAR
    const botonEliminar = document.createElement('button');
    botonEliminar.className = 'btn-hecha';
    botonEliminar.textContent = 'Eliminar';
    // Pide confirmación y elimina al hacer click
    botonEliminar.addEventListener('click', () => eliminarMiembro(miembro.id_user));

    //Agregamos elementos
    acciones.appendChild(botonEditar);
    acciones.appendChild(botonEliminar);

    // Montamos la fila de izquierda a derecha: avatar, info, botones
    fila.appendChild(avatar);
    fila.appendChild(info);
    fila.appendChild(acciones);

    return fila;
}

// Reemplaza el contenido de la fila por un formulario de edición
async function activarModoEdicion(fila, miembro) {
    // Vacía la fila actual
    fila.innerHTML = '';
    // Construye el formulario con los datos actuales del miembro
    const form = await construirFormularioEdicion(fila, miembro);
    fila.appendChild(form);
}

//Esto arma el formulario inline con los campos editables
async function construirFormularioEdicion(fila, miembro) {
    const form = document.createElement('div');
    form.className = 'edit-form';

    // Columna izquierda aquí van nombre y email
    const editInfo = document.createElement('div');
    editInfo.className = 'edit-info';

    const inputNombre = document.createElement('input');
    inputNombre.className = 'input is-small';
    inputNombre.type = 'text';
    inputNombre.value = miembro.nombre;

    const inputEmail = document.createElement('input');
    inputEmail.className = 'input is-small';
    inputEmail.type = 'email';
    inputEmail.value = miembro.email;

    editInfo.appendChild(inputNombre);
    editInfo.appendChild(inputEmail);

    // Columna central donde van la contraseña y fecha de nacimiento
    const editDatos = document.createElement('div');
    editDatos.className = 'edit-datos';

    const inputContrasenia = document.createElement('input');
    inputContrasenia.className = 'input is-small';
    // label contrasenia
    inputContrasenia.type = 'password';
    inputContrasenia.placeholder = 'Nueva contraseña';
    inputContrasenia.value = miembro.contrasenia;

    const inputFecha = document.createElement('input');
    inputFecha.className = 'input is-small';
    inputFecha.type = 'date';
    // max de la fecha de nacimiento
    inputFecha.max = new Date().toISOString().split('T')[0];
    // substring(0, 10) extrae "aaaa-mm-dd" del formato ISO completo. En este caso mostramos año al ser una fecha de cumpleaños
    inputFecha.value = miembro.fecha_nacimiento
        ? miembro.fecha_nacimiento.substring(0, 10)
        : '';

    editDatos.appendChild(inputContrasenia);
    editDatos.appendChild(inputFecha);
    // Columna derecha: botones Guardar / Cancelar
    const editAcciones = document.createElement('div');
    editAcciones.className = 'edit-acciones';

    const botonGuardar = document.createElement('button');
    botonGuardar.className = 'btn-elegir';
    botonGuardar.textContent = 'Guardar';
    botonGuardar.addEventListener('click', () => {
        const datosEditados = {
            nombre: inputNombre.value,
            email: inputEmail.value,
            contrasenia: inputContrasenia.value,
            fecha_nacimiento: inputFecha.value || null,
        };
        guardarEdicion(miembro.id_user, datosEditados);
    });

    const botonCancelar = document.createElement('button');
    botonCancelar.className = 'btn-hecha';
    botonCancelar.textContent = 'Cancelar';

    // Vuelve a mostrar la fila original sin guardar cambios
    botonCancelar.addEventListener('click', () => cancelarEdicion(fila, miembro));

    editAcciones.appendChild(botonGuardar);
    editAcciones.appendChild(botonCancelar);

    form.appendChild(editInfo);
    form.appendChild(editDatos);
    form.appendChild(editAcciones);

    return form;
}


//Esto restaura la fila a su estado original (descarta edición)
function cancelarEdicion(fila, miembro) {
    const filaOriginal = crearFila(miembro);
    fila.replaceWith(filaOriginal);
}

//Enviar cambios editados al backend con PUT
async function guardarEdicion(id, datosEditados) {
    try {
        const res = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEditados),
        });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        //Recarga tabla completa para reflejar cambios
        await cargarMiembros();
        mostrarToast('Miembro editado exitosamente');
    } catch (error) {
        mostrarToast('Error al editar miembro', 'error');
        console.error("Error al guardar edición", error);
    }
}
// Soft delete: desactiva al usuario en la BD (activo = FALSE)
async function eliminarMiembro(id) {
    // confirm() muestra un cuadro de diálogo nativo del navegador
    const confirmar = confirm('¿Seguro que querés eliminar este miembro?');
    if (!confirmar) return; //El usuario cancela y no se hace nada

    try {
        const res = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        await cargarMiembros();
        mostrarToast('Miembro eliminado exitosamente');
    } catch (error) {
        console.error("Error al eliminar miembro", error);
        mostrarToast('Error al eliminar miembro', 'error');
    }
}

// Configura el submit del formulario de creación de usuario
function registrarHandlerFormulario() {
    const form = document.getElementById('form-crear-miembro');

    form.addEventListener('submit', async (evento) => {
        // Previene que el formulario recargue la página
        evento.preventDefault();

        // FormData lee los inputs por el atributo "name"
        const datos = new FormData(form);
        const nuevoMiembro = {
            nombre: datos.get('nombre'),
            email: datos.get('email'),
            contrasenia: datos.get('contrasenia'),
            fecha_nacimiento: datos.get('fecha_nacimiento') || null,
        };

        try {
            const res = await fetch(URL_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoMiembro),
            });
            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

            // Limpia el formulario después de crear con éxito
            form.reset();
            await cargarMiembros();
            mostrarToast('Miembro creado exitosamente');
        } catch (error) {
            console.error("Error al crear miembro", error);
            mostrarToast('Error al crear miembro', 'error');
        }
    });
}

// Convierte fecha ISO (aaaa-mm-dd) a formato legible en español
function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    // Separa año, mes, día del string ISO
    const [anio, mes, dia] = fechaISO.substring(0, 10).split('-');
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Muestra una notificación toast en la esquina superior derecha
function mostrarToast(mensaje, tipo = 'exito') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast ${tipo}`;
    // Agrega la clase "show" después de 10ms para activar la animación CSS
    setTimeout(() => toast.classList.add('show'), 10);
    // Oculta el toast después de 3 segundos
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Punto de entrada: ejecuta init cuando el DOM está listo
init();
// llamada a la función para establecer la fecha máxima
establecerFechaMaxima();    
