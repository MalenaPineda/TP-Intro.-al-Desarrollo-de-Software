import { Router } from "express";
import { db } from "../../../db/pool.js";

export const endpointsGastos = Router();

export async function getGastos() {
  const result = await db.query("SELECT g.id_gasto,g.descripcion,g.monto,g.fecha_gasto,g.metodo_pago,g.categoria,u.id_user,u.nombre FROM gastos g, usuarios u WHERE g.id_user = u.id_user ORDER BY g.fecha_gasto DESC; ")
  return result.rows;
}

endpointsGastos.get("/", async (req, res) => {
  try {
    const gastos = await getGastos();
    res.json(gastos);

  } catch (error) {
    console.error("Error al obtener los gastos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});