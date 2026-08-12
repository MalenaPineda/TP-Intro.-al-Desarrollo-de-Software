/*DELETE FROM categoria_tareas 
WHERE id_categoria = (
  SELECT id_categoria FROM categoria_tareas 
  WHERE nombre = 'Compras' 
  ORDER BY id_categoria DESC 
  LIMIT 1
);*/
-- Junio 2026
INSERT INTO gastos (descripcion, monto, fecha_gasto, id_metodo, categoria, id_user) VALUES
('Supermercado', 15400.00, '2026-06-03', 1, 1, 1),
('Nafta',         8200.00, '2026-06-12', 2, 2, 1),
('Farmacia',      3650.00, '2026-06-25', 1, 3, 2);

-- Julio 2026
INSERT INTO gastos (descripcion, monto, fecha_gasto, id_metodo, categoria, id_user) VALUES
('Supermercado', 16800.00, '2026-07-05', 1, 1, 1),
('Internet',      9500.00, '2026-07-10',2, 2, 3)