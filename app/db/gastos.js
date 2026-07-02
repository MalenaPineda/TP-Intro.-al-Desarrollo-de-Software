import { db } from "./pool.js";

export async function getGastos() {
    const result = await db.query("SELECT g.id_gasto,g.descripcion,g.monto,g.fecha_gasto,g.metodo_pago,g.categoria,u.id_user,u.nombre FROM gastos g, usuarios u WHERE g.id_user = u.id_user ORDER BY g.fecha_gasto DESC; ")
    return result.rows;
}

export async function getTotalGastosPorUsuario(idUser) {
  const result = await db.query("SELECT SUM(monto) AS total FROM gastos WHERE id_user = $1 AND EXTRACT(MONTH FROM fecha_gasto) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE);",[idUser])
  return result.rows[0];
}

export async function getTotalGastoPorMes() {
  const result = await db.query("SELECT SUM(monto) AS total FROM gastos WHERE EXTRACT(MONTH FROM fecha_gasto) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE);")
  return result.rows[0];
}

export async function getGastosPorCategoria() {
  const result = await db.query("SELECT c.nombre, SUM(g.monto) AS total_monto FROM gastos g, categoria_gastos c WHERE g.categoria = c.id_categoria AND EXTRACT(MONTH FROM g.fecha_gasto) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM g.fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE) GROUP BY c.nombre;")
  return result.rows;
}

export async function createGasto(descripcion, monto, metodo_pago, id_categoria, id_user) {
  const result = await db.query(
    "INSERT INTO gastos (descripcion, monto, metodo_pago, categoria, id_user) VALUES ($1, $2, $3, $4, $5)",
    [descripcion, monto, metodo_pago, id_categoria, id_user]
  );
  return result.rowCount > 0;
}

export async function getNombreCategoria() {
  const result = await db.query("SELECT * FROM categoria_gastos ORDER BY nombre ASC;")
  return result.rows;
}
