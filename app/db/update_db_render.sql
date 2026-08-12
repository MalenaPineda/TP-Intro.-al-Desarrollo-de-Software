DELETE FROM categoria_tareas 
WHERE id_categoria = (
  SELECT id_categoria FROM categoria_tareas 
  WHERE nombre = 'Compras' 
  ORDER BY id_categoria DESC 
  LIMIT 1
);

ALTER TABLE insignias ADD COLUMN activa BOOLEAN DEFAULT TRUE;
js
export async function deleteInsignia(id) {
  const result = await db.query(
    "UPDATE insignias SET activa = FALSE WHERE id_insignia = $1",
    [id]
  );
  return result.rowCount > 0;
}