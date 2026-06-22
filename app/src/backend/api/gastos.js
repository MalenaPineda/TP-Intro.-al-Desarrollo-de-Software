import { Router } from "express";
import { getGastos, getTotalGastosPorUsuario } from "../../../db/gastos.js";


export const endpointsGastos = Router();

endpointsGastos.get("/", async (req, res) => {
  try {
    const gastos = await getGastos();
    res.json(gastos);
  } catch (error) {
    console.error("Error al obtener los gastos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

endpointsGastos.get("/", async (req, res) => {
  try {
    const gastos = await getGastos();
    res.json(gastos);
  } catch (error) {
    console.error("Error al obtener los gastos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

endpointsGastos.get("/:id", async (req, res) => {
  try {
    const idUser = req.params.id;
    const total = await getTotalGastosPorUsuario(idUser);
    res.json(total);
  } catch (error) {
    console.error("Error al obtener el total del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});