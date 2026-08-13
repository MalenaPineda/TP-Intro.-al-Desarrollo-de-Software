import cors from "cors";
import express from "express";

import { endpointsGastos } from "./src/backend/api/gastos.js";
import { rutaTareas } from "./src/backend/api/tareas.js";
import { rutaUsuarios } from "./src/backend/api/usuarios.js";
import { endpointsInsignias } from "./src/backend/api/insignias.js";


const app = express();
const port = 8000;
app.use(cors({
  origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use("/api/v1/gastos", endpointsGastos);
app.use("/api/v1/tareas", rutaTareas);
app.use("/api/v1/usuarios",rutaUsuarios);
app.use("/api/v1/insignias", endpointsInsignias);

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Convivencia listening on port ${port}`);
});
