import { db } from "./pool.js"

export async function getTareas() {
    const resultado = await db.query("SELECT * FROM tareas")
    return resultado.rows
}

export async function getTareasPorId(id) {
    const resultado = await db.query("SELECT * FROM tareas WHERE id_tarea = $1", [id]);
    return resultado.rows[0];
}

export async function crearTarea(descripcion, fecha_vencimiento, id_categoria, notas) {
    const resultado = await db.query(
        `INSERT INTO tareas (descripcion, fecha_vencimiento, id_categoria, notas) VALUES ($1, $2, $3, $4)
        RETURNING *`, [descripcion,fecha_vencimiento,id_categoria, notas]);
        return resultado.rows[0];
}

export async function borrarTarea(id) {
    const resultado = await db.query("DELETE FROM tareas WHERE id_tarea = $1 RETURNING *", [id]);
    return resultado.rows[0];
}

export async function cambiarEstadoTarea(id,estado) {
    const resultado = await db.query("UPDATE tareas SET estado = $1 WHERE id_tarea = $2 RETURNING *",[estado, id]);
    return resultado.rows[0];
}
//Función para solicitar a la base de datos las tareas con toda la información necesaria. 

export async function getTareasCompletas() {
    //En proceso de terminar
    const resultado = await db.query(`SELECT 
        tareas.id_tarea,
        tareas.descripcion,
        tareas.fecha_vencimiento,
        tareas.fecha_creacion,
        tareas.diaria,
        tareas.estado,
        tareas.notas,
        categoria_tareas.nombre AS categoria,
        array_agg(usuarios.nombre) AS usuario 
        FROM tareas 
        JOIN categoria_tareas ON tareas.id_categoria = categoria_tareas.id_categoria
         JOIN tarea_user ON tareas.id_tarea = tarea_user.id_tarea JOIN usuarios ON tarea_user.id_user = usuarios.id_user
         GROUP BY tareas.id_tarea, categoria_tareas.nombre`) //array_agg es una función que hace que muestre en este un array en los usuarios en el caso de que haya más de uno asignado para la misma tarea 
    return resultado.rows;
}

export async function asignarUsuario(id_tarea, id_user) {
    const resultado = await db.query(`INSERT INTO tarea_user(id_tarea,id_user) VALUES ($1,$2) RETURNING *`, [id_tarea,id_user]);

    return resultado.rows[0];
}