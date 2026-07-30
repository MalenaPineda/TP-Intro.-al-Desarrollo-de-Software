const URL_API_USUARIOS = 'http://localhost:8000/api/v1/usuarios';

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
function toggleDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (!dropdown) return;
    if (dropdown.style.display === 'block') {
        ocultarDropdown();
    } else {
        cargarDropdownMiembros();
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
    const selector = document.getElementById('selector-usuario');
    if (selector) selector.addEventListener('click', toggleDropdown);
    // Cierra el dropdown si se clickea afuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#selector-usuario') && !e.target.closest('#user-dropdown')) {
            ocultarDropdown();
        }
    });
}

initSidebar();