import { Router } from 'express';

import { getInsignias } from "../../../db/insignias.js";
export const endpointsInsignias = Router();

endpointsInsignias.get("/", async (req, res) => {
    try {
      const insignias = await getInsignias();
      res.json(insignias);
    } catch (error) {
      console.error("Error al obtener las insigneas:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });