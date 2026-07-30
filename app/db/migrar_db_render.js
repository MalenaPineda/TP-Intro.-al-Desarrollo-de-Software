import { readFileSync } from "fs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function run(file) {
  const sql = readFileSync(file, "utf8");
  await pool.query(sql);
  console.log(` Ejecutado: ${file}`);
}

async function main() {
  //await run("./delete.sql");     // Borra todo
  //await run("./schemas.sql");    // Crea tablas de nuevo
  //await run("./seeds.sql");       // Inserta datos nuevos
  await run("./update_db_render.sql");  // Agrega esta línea
  await pool.end();
  }
main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});