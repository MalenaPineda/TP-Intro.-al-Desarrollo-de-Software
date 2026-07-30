import { db } from "./pool.js";

//Todos los usuarios
export async function getUsuarios() {
    const resultado = await db.query("SELECT * FROM usuarios WHERE activo = TRUE");
    return resultado.rows;
}

export async function getTodosLosUsuarios() {
    const resultado = await db.query(`SELECT * FROM usuarios`);
    return resultado.rows;
}


//Usuario por id
export async function getUsuarioPorId(id) {
    const resultado = await db.query("SELECT * FROM usuarios WHERE id_user = $1", [id]);
    return resultado.rows[0];
}

//Crear usuario
export async function crearUsuario(nombre, email, contrasenia, fecha_nacimiento) {
    const resultado = await db.query(`INSERT INTO usuarios (nombre, email, contrasenia,fecha_nacimiento) VALUES ($1, $2, $3, $4) RETURNING *`,[nombre,email,contrasenia,fecha_nacimiento]);
    return resultado.rows[0];
}

export async function editarUsuario(id,nombre,email,contrasenia,fecha_nacimiento) {
    const resultado = await db.query(`UPDATE usuarios SET nombre = $1, email = $2, contrasenia = $3, fecha_nacimiento = $4 WHERE id_user = $5 RETURNING *`, [nombre,email,contrasenia,fecha_nacimiento,id]);
    return resultado.rows[0];
}

//En este caso hacemos soft delete, simpleente cambiamos su estado activo para mantener sus tareas y gastos
export async function borrarUsuario(id) {
    const resultado = await db.query(`UPDATE usuarios SET activo = FALSE WHERE id_user = $1 RETURNING *`,[id]);
    return resultado.rows[0];
}





