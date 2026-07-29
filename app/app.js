import cors from "cors";
import express from "express";

import { endpointsGastos } from "./src/backend/api/gastos.js";
import { rutaTareas } from "./src/backend/api/tareas.js";

const app = express();
const port = 8000;
app.use(cors({
  origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
  credentials: true,
<<<<<<< HEAD
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
=======
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
>>>>>>> development
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use("/api/v1/gastos", endpointsGastos);
app.use("/api/v1/tareas", rutaTareas);

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Convivencia listening on port ${port}`);
});
