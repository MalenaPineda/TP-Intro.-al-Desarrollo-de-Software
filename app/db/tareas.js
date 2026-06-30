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

export async function getTareasCompletadas(id,estado) {
    const resultado = await db.query("SELECT * FROM tarea WHERE estado = ")
}