import { Router } from "express";
import { db } from "../../../db/pool.js";

export const endpointsGastos = Router();

export async function getGastos() {
  const result = await db.query("SELECT * FROM gastos");
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