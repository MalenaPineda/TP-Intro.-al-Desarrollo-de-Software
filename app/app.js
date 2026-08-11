import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { endpointsGastos } from "./src/backend/api/gastos.js";
import { rutaTareas } from "./src/backend/api/tareas.js";
import { rutaUsuarios } from "./src/backend/api/usuarios.js";
import { endpointsInsignias } from "./src/backend/api/insignias.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/frontend')));

app.use("/api/v1/gastos", endpointsGastos);
app.use("/api/v1/tareas", rutaTareas);
app.use("/api/v1/usuarios", rutaUsuarios);
app.use("/api/v1/insignias", endpointsInsignias);

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get('/:path', (req, res) => {
  res.sendFile(`app/src/frontend/${req.params.path}.html`);
});

app.listen(PORT, () => {
  console.log(`Convivencia listening on port ${PORT}`);
});