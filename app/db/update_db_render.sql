-- Tareas del hogar
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria) VALUES 
('Lavar los platos', '2026-06-24', TRUE, 'en progreso', 'Después de la cena', 2),
('Sacar la basura', '2026-06-24', TRUE, 'en progreso', 'Turno de Jesús', 1),
('Comprar papel higiénico', '2026-06-25', FALSE, 'en progreso', 'Hacer lista de compras', 6),
('Revisar la lámpara del living', '2026-06-27', FALSE, 'completada', 'Posible cambio de foco', 3),
('Limpiar el baño', '2026-07-28', FALSE, 'pendiente', 'Limpiar pisa y bacha', 1),
('Comprar flores para el living', '2026-08-01', FALSE, 'pendiente', NULL, 6);

-- Tareas de Cocina para María (id=4) - Chef del mes
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria) VALUES 
('Preparar desayuno', '2026-07-20', FALSE, 'completada', NULL, 2),
('Cocinar cena', '2026-07-21', FALSE, 'completada', NULL, 2),
('Limpiar horno', '2026-07-22', FALSE, 'completada', NULL, 2);

-- Tareas de Limpieza para María (id=4) - Eco-friendly
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria) VALUES 
('Limpiar pisos', '2026-07-19', FALSE, 'completada', NULL, 1),
('Lavar ropa', '2026-07-20', FALSE, 'completada', NULL, 1),
('Limpiar ventanas', '2026-07-21', FALSE, 'completada', NULL, 1);

-- Tareas de Mantenimiento para Jesús (id=3) - Manitas de oro
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria) VALUES 
('Reparar grifo', '2026-07-15', FALSE, 'completada', NULL, 3),
('Cambiar bombillas', '2026-07-16', FALSE, 'completada', NULL, 3),
('Reparar puerta', '2026-07-17', FALSE, 'completada', NULL, 3);

-- Tareas de Jardinería para Jesús (id=3) - Pulgar verde
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria) VALUES 
('Regar plantas', '2026-07-14', FALSE, 'completada', NULL, 4),
('Podar arbustos', '2026-07-15', FALSE, 'completada', NULL, 4),
('Limpiar macetas', '2026-07-16', FALSE, 'completada', NULL, 4);