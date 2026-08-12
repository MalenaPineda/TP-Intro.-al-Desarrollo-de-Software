DELETE FROM categoria_tareas 
WHERE id_categoria = (
  SELECT id_categoria FROM categoria_tareas 
  WHERE nombre = 'Compras' 
  ORDER BY id_categoria DESC 
  LIMIT 1
);