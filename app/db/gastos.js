import { db } from "./pool.js";

export async function getGastos() {
  const result = await db.query(`
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feature/borrar-gasto
  SELECT 
  g.id_gasto,
  g.descripcion,
  g.monto,
  g.fecha_gasto,
  g.categoria,
  u.id_user,
  u.nombre,
  m.nombre AS metodo_pago
FROM gastos g, usuarios u, metodo_pago m
WHERE g.id_user = u.id_user
AND g.id_metodo = m.id
ORDER BY g.fecha_gasto DESC
`)
<<<<<<< HEAD
=======
    SELECT 
      g.id_gasto,
      g.descripcion,
      g.monto,
      g.fecha_gasto,
      g.categoria,
      u.id_user,
      u.nombre,
      m.nombre AS metodo_pago
    FROM gastos g, usuarios u, metodo_pago m
    WHERE g.id_user = u.id_user
    AND g.id_metodo = m.id
    ORDER BY g.fecha_gasto DESC
  `)
>>>>>>> origin/fix/base-datos
=======
>>>>>>> origin/feature/borrar-gasto
  return result.rows;
}

export async function getTotalGastosPorUsuario(idUser) {
  const result = await db.query("SELECT SUM(monto) AS total FROM gastos WHERE id_user = $1 AND EXTRACT(MONTH FROM fecha_gasto) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE);",[idUser])
  return result.rows[0];
}

export async function getTotalGastoPorMes() {
  const result = await db.query("SELECT SUM(monto) AS total FROM gastos WHERE EXTRACT(MONTH FROM fecha_gasto) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE);")
  return result.rows[0];
}

export async function getGastosPorCategoria() {
  const result = await db.query("SELECT c.nombre, SUM(g.monto) AS total_monto FROM gastos g, categoria_gastos c WHERE g.categoria = c.id_categoria AND EXTRACT(MONTH FROM g.fecha_gasto) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM g.fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE) GROUP BY c.nombre;")
  return result.rows;
}

export async function createGasto(descripcion, monto, metodo_pago, id_categoria, id_user) {
  const result = await db.query(
    "INSERT INTO gastos (descripcion, monto, id_metodo, categoria, id_user) VALUES ($1, $2, $3, $4, $5)",
    [descripcion, monto, metodo_pago, id_categoria, id_user]
  );
  return result.rowCount > 0;
}

export async function getNombreCategoria() {
  const result = await db.query("SELECT * FROM categoria_gastos ORDER BY nombre ASC;")
  return result.rows;
}

export async function getMetodoPago() {
  const result = await db.query("SELECT * FROM metodo_pago ORDER BY nombre ASC;")
  return result.rows;
}

export async function getGastosPorMes() {
  const result = await db.query(`
    SELECT 
      EXTRACT(MONTH FROM fecha_gasto) AS mes,
      EXTRACT(YEAR FROM fecha_gasto) AS anio,
      SUM(monto) AS total
    FROM gastos
    GROUP BY anio, mes
    ORDER BY anio ASC, mes ASC
  `);
  return result.rows;
  
}
<<<<<<< HEAD
<<<<<<< HEAD

export async function updateGasto(id, descripcion, monto, metodo_pago, id_categoria) {
  const result = await db.query(
    "UPDATE gastos SET descripcion = $1, monto = $2, id_metodo = $3, categoria = $4 WHERE id_gasto = $5",
=======

export async function updateGasto(id, descripcion, monto, metodo_pago, id_categoria) {
  const result = await db.query(
    "UPDATE gastos SET descripcion = $1, monto = $2, metodo_pago = $3, categoria = $4 WHERE id_gasto = $5",
>>>>>>> origin/feature/editar-gasto
    [descripcion, monto, metodo_pago, id_categoria, id]
  );
  return result.rowCount > 0;
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feature/borrar-gasto

export async function deleteGasto(id) {
  const result = await db.query("DELETE FROM gastos WHERE id_gasto = $1",[id]);
  return result.rowCount > 0;
}
<<<<<<< HEAD
=======
>>>>>>> origin/feature/ver-gastos
=======
>>>>>>> origin/feature/editar-gasto
=======
>>>>>>> origin/feature/borrar-gasto
