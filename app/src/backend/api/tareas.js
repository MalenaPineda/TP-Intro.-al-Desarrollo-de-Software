import { Router } from "express";
import { getRankingTareas } from "../../../db/tareas.js";

export const endpointsTareas = Router();

endpointsTareas.get("/ranking", async (req, res) => {
  try {
    const ranking = await getRankingTareas();
    res.json(ranking);
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
