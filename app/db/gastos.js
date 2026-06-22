import { db } from "./pool.js";

export async function getGastos() {
    const result = await db.query("SELECT g.id_gasto,g.descripcion,g.monto,g.fecha_gasto,g.metodo_pago,g.categoria,u.id_user,u.nombre FROM gastos g, usuarios u WHERE g.id_user = u.id_user ORDER BY g.fecha_gasto DESC; ")
    return result.rows;
}

export async function getTotalGastosPorUsuario(idUser) {
  const result = await db.query("SELECT SUM(monto) AS total FROM gastos WHERE id_user = $1 AND EXTRACT(MONTH FROM fecha_gasto) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE);",[idUser])
  return result.rows;
}