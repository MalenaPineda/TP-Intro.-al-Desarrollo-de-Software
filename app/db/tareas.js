import { db } from "./pool.js"

export async function getTareas() {
    const resultado = await db.query("SELECT * FROM tareas ORDER BY (estado = 'hecha') ASC, fecha_vencimiento ASC, fecha_creacion ASC");
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
    const resultado = await db.query(estado === 'hecha' ? "UPDATE tareas SET estado = $1, fecha_completada = CURRENT_TIMESTAMP WHERE id_tarea = $2 RETURNING *" : "UPDATE tareas SET estado = $1, fecha_completada = NULL WHERE id_tarea = $2 RETURNING *", [estado, id]);
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
        LEFT JOIN usuarios ON tarea_user.id_user = usuarios.id_user
        ORDER BY (tareas.estado = 'hecha') ASC,
        tareas.fecha_vencimiento ASC,
        tareas.fecha_creacion ASC `)

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
        LEFT JOIN tarea_user ON tareas.id_tarea = tarea_user.id_tarea WHERE tarea_user.id_tarea IS NULL
        ORDER BY (tareas.estado = 'hecha') ASC,
        tareas.fecha_vencimiento ASC,
        tareas.fecha_creacion ASC 
        `);
        
        return resultado.rows;

}


export async function getMisTareas(id_user) {
    const resultado = await db.query(`
        SELECT tareas.*, categoria_tareas.nombre AS categoria, usuarios.nombre AS usuario
        FROM tareas
        JOIN categoria_tareas ON tareas.id_categoria = categoria_tareas.id_categoria
        JOIN tarea_user ON tareas.id_tarea = tarea_user.id_tarea
        JOIN usuarios ON tarea_user.id_user = usuarios.id_user
        WHERE tarea_user.id_user = $1
        ORDER BY (tareas.estado = 'hecha') ASC,
        tareas.fecha_vencimiento ASC,
        tareas.fecha_creacion ASC 
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
        ORDER BY (tareas.estado = 'hecha') ASC,
        tareas.fecha_vencimiento ASC,
        tareas.fecha_creacion ASC 
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

export async function getInsigniasPorUsuario() {
  const result = await db.query(`
    SELECT
      u.id_user,
      i.nombre AS insignia,
      ic.clase AS icono_clase,
      ic.color AS icono_color
    FROM usuarios u
    JOIN tarea_user tu ON tu.id_user = u.id_user
    JOIN tareas t ON tu.id_tarea = t.id_tarea
    JOIN insignias i ON i.id_categoria_tarea = t.id_categoria
    LEFT JOIN iconos ic ON ic.id_icono = i.icono
    WHERE t.estado = 'hecha'
    GROUP BY u.id_user, i.id_insignia, i.nombre, ic.clase, ic.color
    HAVING COUNT(t.id_tarea) >= i.cant_tarea
  `);
  return result.rows;
}

export async function getPuntosDelMes() {
  const result = await db.query(`
    SELECT
      u.id_user,
      u.nombre,
      COALESCE(g.ganados, 0) - COALESCE(p.perdidas, 0) * 3 AS puntos
    FROM usuarios u
    LEFT JOIN (
      SELECT tu.id_user, COUNT(t.id_tarea) AS ganados
      FROM tarea_user tu, tareas t
      WHERE tu.id_tarea = t.id_tarea
      AND t.estado = 'hecha'
      AND DATE_TRUNC('month', t.fecha_completada) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY tu.id_user
    ) g ON g.id_user = u.id_user
    LEFT JOIN (
      SELECT tu.id_user, COUNT(t.id_tarea) AS perdidas
      FROM tarea_user tu, tareas t
      WHERE tu.id_tarea = t.id_tarea
      AND t.estado != 'hecha'
      AND t.fecha_vencimiento < CURRENT_DATE
      GROUP BY tu.id_user
    ) p ON p.id_user = u.id_user
    WHERE g.ganados IS NOT NULL OR p.perdidas IS NOT NULL
    ORDER BY puntos DESC
  `);
  return result.rows;
}
