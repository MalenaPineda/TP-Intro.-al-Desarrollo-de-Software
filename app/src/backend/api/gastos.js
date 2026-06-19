import { db } from "../../../db/pool.js";

export async function getGastos() {
  const result = await db.query("SELECT * FROM gastos");
  return result.rows;
}

