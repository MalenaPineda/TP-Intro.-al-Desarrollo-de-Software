import { db } from "../../../db/pool.js";

export async function getGastos() {
    const result = await db.query("SELECT g.id_gasto,g.descripcion,g.monto,g.fecha_gasto,g.metodo_pago,g.categoria,u.id_user,u.nombre FROM gastos g, usuarios u WHERE g.id_user = u.id_user ORDER BY g.fecha_gasto DESC; ")
    return result.rows;
  }