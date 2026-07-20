import express from "express";
import cors from "cors";

import { endpointsGastos } from "./src/backend/api/gastos.js";
<<<<<<< HEAD
import { rutaTareas } from "./src/backend/api/tareas.js";
=======
>>>>>>> d822528838800fe9fefae368d9468efe047300a0

const app = express();
const port = 8000;
app.use(cors()); 


app.use(express.json());
app.use("/api/v1/gastos", endpointsGastos);
<<<<<<< HEAD
app.use("/api/v1/tareas", rutaTareas);
=======
>>>>>>> d822528838800fe9fefae368d9468efe047300a0

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Convivencia listening on port ${port}`);
});