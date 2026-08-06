import { Router } from 'express';

import { getInsignias, createInsignia, updateInsignia, deleteInsignia } from "../../../db/insignias.js";
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


  endpointsInsignias.post("/", async (req, res) => {
    const { nombre, descripcion, cant_tarea, id_categoria_tarea, icono } = req.body;

    if (!nombre || !descripcion || !cant_tarea) {
      res.status(400).send("Faltan campos obligatorios");
      return;
    }
  
    try {
    const updated = await updateInsignia(id, nombre, descripcion, cant_tarea, id_categoria_tarea, icono);      res.status(201).json(insignia);
    } catch (error) {
      console.error("Error al crear insignia:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });


  endpointsInsignias.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await deleteInsignia(id);
      if (!deleted) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error al borrar insignia:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
  

endpointsInsignias.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, descripcion, cant_tarea, id_categoria_tarea } = req.body;
    const updated = await updateInsignia(id, nombre, descripcion, cant_tarea, id_categoria_tarea);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al actualizar insignia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});  
