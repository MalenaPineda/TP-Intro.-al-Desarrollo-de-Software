import { Router } from "express";
import { getRankingTareas, getInsigniasPorUsuario } from "../../../db/tareas.js";

export const endpointsTareas = Router();

endpointsTareas.get("/ranking", async (req, res) => {
  try {
    const ranking = await getRankingTareas();
    const insigniasPorUsuario = await getInsigniasPorUsuario();

    const rankingConInsignias = ranking.map((usuario) => ({
      ...usuario,
      insignias: insigniasPorUsuario
        .filter((i) => i.id_user === usuario.id_user)
        .map((i) => ({ nombre: i.insignia, icono: i.icono })),
    }));

    res.json(rankingConInsignias);
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
