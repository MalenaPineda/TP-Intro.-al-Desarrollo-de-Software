const URL_API_USUARIOS = `${window.location.origin}/api/v1/usuarios`;

//Esto lee el usuario guardado en el localStorage del navegador o devuelve uni por defecto

function getUsuarioActual() {
    const guardado = localStorage.getItem(`usuario_actual`);
    if(guardado) return JSON.parse(guardado);
    return {id_user: 1, nombre: 'Juan Perez'}; 
}

// Guarda el usuario seleccionado en localStorage
function setUsuarioActual(usuario) {
    localStorage.setItem('usuario_actual', JSON.stringify(usuario));
}

// Actualiza el sidebar con el nombre e inicial del usuario actual
function actualizarSidebar() {
    const usuario = getUsuarioActual();
    const avatar = document.getElementById('user-avatar');
    const nombre = document.getElementById('user-name');
    if (avatar) avatar.textContent = usuario.nombre.charAt(0).toUpperCase();
    if (nombre) nombre.textContent = usuario.nombre;
}

// Carga los miembros activos en el dropdown
async function cargarDropdownMiembros() {
    const dropdown = document.getElementById('user-dropdown');
    if (!dropdown) return;
    try {
        const res = await fetch(URL_API_USUARIOS);
        if (!res.ok) throw new Error('Error al cargar miembros');
        const miembros = await res.json();
        dropdown.innerHTML = '';
        miembros.forEach(m => {
            const item = document.createElement('div');
            item.className = 'user-dropdown-item';
            item.textContent = m.nombre;
            item.dataset.id = m.id_user;
            item.addEventListener('click', () => {
                setUsuarioActual({ id_user: m.id_user, nombre: m.nombre });
                actualizarSidebar();
                ocultarDropdown();
                location.reload(); // recarga la página para reflejar el cambio
            });
            dropdown.appendChild(item);
        });
    } catch (error) {
        console.error('Error al cargar dropdown de miembros', error);
    }
}

// Muestra/oculta el dropdown al clickear el usuario en el sidebar
async function toggleDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (!dropdown) return;
    if (dropdown.style.display === 'block') {
        ocultarDropdown();
    } else {
       await cargarDropdownMiembros();
        dropdown.style.display = 'block';
    }
}

function ocultarDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.style.display = 'none';
}

// Inicializa el sidebar: muestra el usuario actual y registra el click
function initSidebar() {
    actualizarSidebar();
    cargarCantidadMiembros();   
    const selector = document.getElementById('selector-usuario');
    if (selector) selector.addEventListener('click', toggleDropdown);
    // Cierra el dropdown si se clickea afuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#selector-usuario') && !e.target.closest('#user-dropdown')) {
            ocultarDropdown();
        }
    });
}

//Para que en el side bar se muestre la cantidad de miembros en la casa de forma dinámica
async function cargarCantidadMiembros() {
    const elemento = document.getElementById('cantidad-miembros');
    if (!elemento) return;
    try {
        const res = await fetch(URL_API_USUARIOS); // solo usuarios activos
        if (!res.ok) throw new Error('Error al cargar miembros');
        const miembros = await res.json();
        elemento.textContent = miembros.length === 1 ? '1 miembro' : `${miembros.length} miembros`;
    } catch (error) {
        console.error('Error al cargar cantidad de miembros', error); // conserva el texto por defecto
    }
}
initSidebar();

//VENCIMIENTO DE TAREAS


//Tomamos el aaaa-mm-dd de la fecha ya sea como string o como date
function fechaSoloDia(fecha) {
    if(!fecha) return null;
    //Verifica si es un string o un date
    const str = fecha instanceof Date ? fecha.toISOString() : fecha;
    //Se queda con los primeros 10 caracteres
    const soloDia = str.substring(0,10);

    //Devuelve la fecha con regex. .test(soloDia) verifica si la fecha matchea y es válida, en caso de que sí, devuelve la fecha, caso contrario devuelve null
    return /^\d{4}-\d{2}-\d{2}$/.test(soloDia) ? soloDia : null;

}

//Ver cuántos días faltan o pasaron hasta la fecha de vencimiento
function diasParaVencer(fechaVencimiento){
    const vence = fechaSoloDia(fechaVencimiento);
    if(!vence) {
        return null;
    }
    //Devuelve la fecha en numeros y asigna su correspondiente a las variables
    const [anio, mes, dia] = vence.split('-').map(Number);
    
    const momentoVencimientoenMiliSeg = Date.UTC(anio,mes-1,dia);

    const hoy = new Date();
    const hoyEnMiliseg = Date.UTC(hoy.getFullYear(), hoy.getMonth() ,hoy.getDate());
    //Operación para calcular el restante de días. Ya que cuando se obtiene una fecha, viene en milisegundos.
    return Math.round((momentoVencimientoenMiliSeg-hoyEnMiliseg)/86400000);
}

//Traducimos la cantidad de días a un mensaje para el usuario
//Devuelve null si no hay que avisar (si tiene más de 3 días para que venza)
function infoVencimiento(fechaVencimiento) {
    const dias = diasParaVencer(fechaVencimiento);
    if (dias === null) {
        return null;
    }

    if (dias<0) {
        //Si ya pasó de la fecha de vencimiento cambiamos el signo
        const diasPasados = -dias;
        const texto = diasPasados === 1 ? 'Vencida hace 1 día' : `Vencida hace ${diasPasados} días`;
        
        return {tipo: 'vencida', texto};
    }
if (dias===0) {
    return {tipo: 'proxima', texto: 'Vence hoy'};
}
if (dias ===1) {
    return {tipo:'proxima', texto: 'Vence mañana'};
}
if (dias<=3) {
    return {tipo: 'proxima', texto: `Vence en ${dias} días`};
}
return null; //Si no es urgente
}


//Crear el aviso de vencimiento de una tarea.
function crearAvisoVencimiento(tarea) {
    //Las tareas hechas no dan aviso
    if (tarea.estado == 'hecha') {
        return null;
    }

    const info = infoVencimiento(tarea.fecha_vencimiento);
    if(!info) {
        return null;
    }

    const avisoVencimiento = document.createElement('span');
    avisoVencimiento.className = `badge-vencimiento ${info.tipo}`;

    avisoVencimiento.textContent = info.texto;
    return avisoVencimiento;
}