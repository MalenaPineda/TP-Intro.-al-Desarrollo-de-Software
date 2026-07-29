import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { endpointsGastos } from "./src/backend/api/gastos.js";
import { rutaTareas } from "./src/backend/api/tareas.js";
//Indican en que carpeta estas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
//Lee el puerto de Render (process.env.PORT). Si no existe, usa 3000 local.
const port = process.env.PORT || 3000;
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'app/src/frontend')));
app.use("/api/v1/gastos", endpointsGastos);
app.use("/api/v1/tareas", rutaTareas);
app.get("/health", (req, res) => {
  res.send("OK");
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/src/frontend/index.html'));
});
app.listen(port, () => {
  console.log(`Convivencia listening on port ${port}`);
});