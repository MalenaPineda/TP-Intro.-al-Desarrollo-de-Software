const URL_API = "http://localhost:8000/api/v1/gastos";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('datos-gastos');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      data.monto = parseFloat(data.monto);
      data.categoria = parseInt(data.categoria, 10);
      data.id_user = 1
      try {
        const response = await fetch(URL_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        console.log(response)
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error al registrar el gasto');
        }
  
        const result = await response.json();
        console.log('Gasto registrado:', result);
        alert('¡Gasto registrado con éxito!');
        form.reset();
  
      } catch (error) {
        console.error(error);
        alert('Hubo un error: ' + error.message);
      }
    });
  });

async function obtenerCategorias() {
  try {
    const respuesta = await fetch(`${URL_API}/nombre-categoria`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const categorias = await respuesta.json()
    mostrarCategorias(categorias);
  } catch (error) {
    console.error("No se pudieron cargar los gastos:", error);
  }
}

function mostrarCategorias(categorias) {
  const contenedor = document.getElementById("categoria");
  contenedor.innerHTML = "";

  categorias.forEach((c) => {
    const opcion = document.createElement("option");
    opcion.value = c.id_categoria;
    opcion.textContent = c.nombre;
    contenedor.appendChild(opcion);
  });
}

async function obtenerMetodoPago() {
  try {
    const respuesta = await fetch(`${URL_API}/metodo-pago`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const metodo = await respuesta.json()
    mostrarMetodoPago(metodo);
  } catch (error) {
    console.error("No se pudieron cargar los gastos:", error);
  }
}

function mostrarMetodoPago(metodo) {
  const contenedor = document.getElementById("metodo-pago");
  contenedor.innerHTML = "";

  metodo.forEach((m) => {
    const opcion = document.createElement("option");
    opcion.value = m.id_metodo;
    opcion.textContent = m.nombre;
    contenedor.appendChild(opcion);
  });
}

obtenerCategorias()
obtenerMetodoPago()