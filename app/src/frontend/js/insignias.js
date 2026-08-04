const URL_API = 'http://localhost:8000/api/v1/tareas';
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
    const select = document.getElementById("categoria");
    select.innerHTML = '';
    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.id_categoria;
        opcion.textContent = categoria.nombre;
        select.appendChild(opcion);
    });
}

obtenerCategorias()