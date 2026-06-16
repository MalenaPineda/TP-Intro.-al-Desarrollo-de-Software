
import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Convivencia listening on port ${port}`);
});