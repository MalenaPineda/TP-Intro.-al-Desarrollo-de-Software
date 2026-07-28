import { db } from "./pool.js"

export async function getTareas() {
    const resultado = await db.query("SELECT * FROM tareas")
    return resultado.rows
}

export async function getNombreCategoriaTarea() {
    const resultado = await db.query('SELECT * FROM categoria_tareas ORDER BY nombre ASC');
    return resultado.rows;
};


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

//PROBLEMA: No deja borrar una fila de tareas si todavía hay registros en tarea_user que la referencian — rompería la integridad referencial (quedaría una relación "huérfana" apuntando a una tarea que ya no existe).
//FIX: Primero se borran las relaciones en tarea_user (la tabla "hija"), y una vez que ya no hay nada que dependa de esa tarea, se borra la tarea en sí de la tabla tareas (la tabla "padre") sin que la FK se quede con valores huérfanos. El orden importa: siempre hijo antes que padre.
export async function borrarTarea(id) {
    await db.query("DELETE FROM tarea_user WHERE id_tarea = $1", [id]);
    const resultado = await db.query("DELETE FROM tareas WHERE id_tarea = $1 RETURNING *", [id]);
    return resultado.rows[0];
}

export async function editarTarea(id,descripcion,fecha_vencimiento,id_categoria,notas) {
    const resultado = await db.query(`UPDATE tareas SET descripcion = $1, fecha_vencimiento = $2, id_categoria =$3, notas = $4 WHERE id_tarea = $5 RETURNING *`, [descripcion,fecha_vencimiento,id_categoria,notas,id]);
    return resultado.rows[0];
}

export async function cambiarEstadoTarea(id,estado) {
    const resultado = await db.query("UPDATE tareas SET estado = $1 WHERE id_tarea = $2 RETURNING *",[estado, id]);
    return resultado.rows[0];
}
//Función para solicitar a la base de datos las tareas con toda la información necesaria. 
//FIX, modifico INNER JOIN por LERFT JOIN para que también traiga las tareas sin asignar
//Además, tomando en cuenta de que es un usuario por tarea, no usamos array_agg ni Group By como estaba anteriormente
export async function getTareasCompletas() {
    const resultado = await db.query(`SELECT 
        tareas.id_categoria,
        tareas.descripcion,
        tareas.id_tarea,
        tareas.fecha_vencimiento,
        tareas.fecha_creacion,
        tareas.diaria,
        tareas.estado,
        tareas.notas,
        categoria_tareas.nombre AS categoria,
        usuarios.nombre AS usuario
        FROM tareas 
        JOIN categoria_tareas ON tareas.id_categoria = categoria_tareas.id_categoria
        LEFT JOIN tarea_user ON tareas.id_tarea = tarea_user.id_tarea
        LEFT JOIN usuarios ON tarea_user.id_user = usuarios.id_user`)

    return resultado.rows;
}

export async function asignarUsuario(id_tarea, id_user) {
    const resultado = await db.query(`INSERT INTO tarea_user(id_tarea,id_user) VALUES ($1,$2) RETURNING *`, [id_tarea,id_user]);

    return resultado.rows[0];
}


export async function getTareasDisponibles() {
    const resultado = await db.query(`SELECT tareas.*, categoria_tareas.nombre AS categoria
        FROM tareas
        JOIN categoria_tareas ON tareas.id_categoria = categoria_tareas.id_categoria
        LEFT JOIN tarea_user ON tareas.id_tarea = tarea_user.id_tarea WHERE tarea_user.id_tarea IS NULL`);

        return resultado.rows;

}


export async function getMisTareas(id_user) {
    const resultado = await db.query(`
        SELECT tareas.*, categoria_tareas.nombre AS categoria
        FROM tareas
        JOIN categoria_tareas ON tareas.id_categoria = categoria_tareas.id_categoria
        JOIN tarea_user ON tareas.id_tarea = tarea_user.id_tarea
        WHERE tarea_user.id_user = $1
    `, [id_user]);
    return resultado.rows;
}


export async function getTareasDeOtros(id_user) {
    const resultado = await db.query(`
        SELECT tareas.*, categoria_tareas.nombre AS categoria, usuarios.nombre AS usuario
        FROM tareas
        JOIN categoria_tareas ON tareas.id_categoria = categoria_tareas.id_categoria
        JOIN tarea_user ON tareas.id_tarea = tarea_user.id_tarea
        JOIN usuarios ON tarea_user.id_user = usuarios.id_user
        WHERE tarea_user.id_user != $1
    `, [id_user]);
    return resultado.rows;
}


export async function getRankingTareas() {
  const result = await db.query(`
    SELECT
      u.id_user,
      u.nombre,
      COUNT(t.id_tarea) AS tareas_completadas
    FROM tarea_user tu, tareas t, usuarios u
    WHERE tu.id_tarea = t.id_tarea
    AND tu.id_user = u.id_user
    AND t.estado = 'hecha'
    GROUP BY u.id_user, u.nombre
    ORDER BY tareas_completadas DESC
  `);
  return result.rows;
}
