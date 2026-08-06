import { db } from "./pool.js"

export async function getInsignias() {
    const resultado = await db.query(`
      SELECT 
        i.id_insignia,
        i.nombre,
        i.descripcion,
        i.cant_tarea,
        i.icono,
        i.id_categoria_tarea,
        c.nombre AS categoria
      FROM insignias i, categoria_tareas c
      WHERE i.id_categoria_tarea = c.id_categoria
      ORDER BY i.id_insignia ASC
    `);
    return resultado.rows;
}

export async function createInsignia(nombre, descripcion, cant_tarea, id_categoria_tarea, icono) {
    const result = await db.query(
      "INSERT INTO insignias (nombre, descripcion, cant_tarea, id_categoria_tarea, icono) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, descripcion, cant_tarea, id_categoria_tarea, icono]
    );
    return result.rows[0];
}

export async function updateInsignia(id, nombre, descripcion, cant_tarea, id_categoria_tarea, icono) {
    const result = await db.query(
      "UPDATE insignias SET nombre = $1, descripcion = $2, cant_tarea = $3, id_categoria_tarea = $4, icono = $5 WHERE id_insignia = $6",
      [nombre, descripcion, cant_tarea, id_categoria_tarea, icono, id]
    );
    return result.rowCount > 0;
}

export async function deleteInsignia(id) {
    const result = await db.query("DELETE FROM insignias WHERE id_insignia = $1", [id]);
    return result.rowCount > 0;
  }
  
 