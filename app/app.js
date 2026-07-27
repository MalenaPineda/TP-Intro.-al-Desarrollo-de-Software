import express from "express";
import cors from "cors";

import { endpointsGastos } from "./src/backend/api/gastos.js";
import { endpointsTareas } from "./src/backend/api/tareas.js";

const app = express();
const port = 8000;
app.use(cors({
  origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use("/api/v1/gastos", endpointsGastos);
app.use("/api/v1/tareas", endpointsTareas);

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Convivencia listening on port ${port}`);
});


app.listen(port, () => {
  console.log(`Convivencia listening on port ${port}`);
});
