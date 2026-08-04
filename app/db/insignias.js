import { db } from "./pool.js"

export async function getInsignias() {
    const resultado = await db.query("SELECT * FROM insignias")
    return resultado.rows
}