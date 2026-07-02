import { Router } from "express";
import { getGastos, getTotalGastosPorUsuario, getTotalGastoPorMes, getGastosPorCategoria, createGasto, getNombreCategoria } from "../../../db/gastos.js";

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

endpointsGastos.get("/total-mes/usuario/:id", async (req, res) => {
  try {
    const idUser = req.params.id;
    const total = await getTotalGastosPorUsuario(idUser);
    res.json(total);
  } catch (error) {
    console.error("Error al obtener el total del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

endpointsGastos.get("/total-mes", async (req, res) => {
  try {
    const total = await getTotalGastoPorMes();
    res.json(total);
  } catch (error) {
    console.error("Error al obtener el total del mes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

endpointsGastos.get("/categoria", async (req, res) => {
  try {
    const total = await getGastosPorCategoria();
    res.json(total);
  } catch (error) {
    console.error("Error al obtener el total del mes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

endpointsGastos.post("/", async (req, res) => {
  if (
    req.body.monto === undefined ||
    isNaN(parseFloat(req.body.monto))
  ) {
    res.status(400).send("Monto not set");
    return;
  }
  if (req.body.descripcion === undefined) {
    res.status(400).send("Descripcion not set");
    return;
  }
  const created = await createGasto(
    req.body.descripcion,
    req.body.monto,
    req.body.metodo_pago,
    req.body.categoria,
    req.body.id_user,
  );
  if (!created) {
    res.sendStatus(500);
    return;
  }
  res.status(201).json({
    descripcion: req.body.descripcion,
    monto: req.body.monto,
    metodo_pago: req.body.metodo_pago,
    categoria: req.body.categoria,
    id_user: req.body.id_user,
  });
});

endpointsGastos.get("/nombre-categoria", async (req, res) => {
  try {
    const categorias = await getNombreCategoria();
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener las categorias:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

