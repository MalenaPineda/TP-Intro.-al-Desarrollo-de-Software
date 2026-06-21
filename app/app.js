import express from "express";
import cors from "cors";

import { endpointsGastos } from "./src/backend/api/gastos.js";

const app = express();
const port = 8000;
app.use(cors()); 


app.use(express.json());
app.use("/api/v1/gastos", endpointsGastos);

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Convivencia listening on port ${port}`);
});