import { db } from "./pool.js";

export async function getRankingTareas() {
  const result = await db.query(`
    SELECT
      u.id_user,
      u.nombre,
      COUNT(t.id_tarea) AS tareas_completadas
    FROM tarea_user tu, tareas t, usuarios u
    WHERE tu.id_tarea = t.id_tarea
    AND tu.id_user = u.id_user
    AND t.estado = 'completada'
    GROUP BY u.id_user, u.nombre
    ORDER BY tareas_completadas DESC
  `);
  return result.rows;
}
