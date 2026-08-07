const URL_GASTOS = "http://localhost:8000/api/v1/gastos";
const URL_CATEGORIAS = "http://localhost:8000/api/v1/gastos/nombre-categoria";

let todosLosGastos = [];
let categoriasDisponibles = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarResumenAnual();
});

async function cargarResumenAnual() {
    try {
        const [respuestaGastos, respuestaCategorias] = await Promise.all([
            fetch(URL_GASTOS),
            fetch(URL_CATEGORIAS)
        ]);

        if (!respuestaGastos.ok || !respuestaCategorias.ok) {
            throw new Error("Error al obtener los datos");
        }

        todosLosGastos = await respuestaGastos.json();
        categoriasDisponibles = await respuestaCategorias.json();

        console.log("Gastos:", todosLosGastos);
        console.log("Categorias:", categoriasDisponibles);

        cargarFiltroCategorias();
        mostrarGastos(todosLosGastos, categoriasDisponibles);

    } catch (error) {
        console.error("Error cargando resumen anual:", error);
    }
}

function cargarFiltroCategorias() {
    const filtro = document.getElementById("filtro-categoria");

    filtro.innerHTML = `
        <option value="">Todas las categorías</option>
    `;

    categoriasDisponibles.forEach(categoria => {
        filtro.innerHTML += `
            <option value="${categoria.id_categoria}">
                ${categoria.nombre}
            </option>
        `;
    });

    filtro.addEventListener("change", () => {
        const categoriaSeleccionada = filtro.value;

        if (categoriaSeleccionada === "") {
            mostrarGastos(todosLosGastos, categoriasDisponibles);
            return;
        }

        const gastosFiltrados = todosLosGastos.filter(gasto =>
            String(gasto.categoria) === String(categoriaSeleccionada)
        );

        mostrarGastos(gastosFiltrados, categoriasDisponibles);
    });
}

function mostrarGastos(gastos, categorias) {
    const tabla = document.getElementById("tabla-gastos");

    tabla.innerHTML = "";

    const mapaCategorias = {};

    categorias.forEach(categoria => {
        mapaCategorias[categoria.id_categoria] = categoria.nombre;
    });
    gastos.sort((a, b) => {
        const fechaA = new Date(a.fecha_gasto);
        const fechaB = new Date(b.fecha_gasto);

        if (fechaB - fechaA !== 0) {
            return fechaB - fechaA;
        }

        return b.id_gasto - a.id_gasto;
    });
    if (gastos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="has-text-centered">
                    No hay gastos para esta categoría.
                </td>
            </tr>
        `;
        return;
    }

    gastos.forEach(gasto => {
        tabla.innerHTML += `
            <tr>
                <td>${formatearFecha(gasto.fecha_gasto)}</td>
                <td>${gasto.descripcion}</td>
                <td>${mapaCategorias[gasto.categoria]}</td>
                <td>${gasto.nombre}</td>
                <td>${gasto.metodo_pago}</td>
                <td class="has-text-right">
                    ${formatearMonto(gasto.monto)}
                </td>
            </tr>
        `;
    });
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-AR");
}

function formatearMonto(monto) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    }).format(Number(monto));
}