-- Usuarios
INSERT INTO usuarios (nombre, email, contrasenia, fecha_nacimiento, activo) VALUES 
('Juan Pérez', 'juan.perez@gmail.com', 'password', '1998-03-14', TRUE),
('Ana Gómez', 'ana.gomez@gmail.com', 'password', '2000-07-22', TRUE);
-- Categorías de Tareas
INSERT INTO categoria_tareas (nombre) VALUES 
('Limpieza'),
('Cocina'),
('Mantenimiento'),
('Jardinería'),
('Mascotas');
-- Categorías de Gastos
INSERT INTO categoria_gastos (nombre) VALUES 
('Alquiler y Expensas'),
('Supermercado'),
('Servicios'),
('Delivery y Salidas'),
('Artículos de Limpieza');
-- Métodos de pago
INSERT INTO metodo_pago (nombre) VALUES 
('Efectivo'),
('Tarjeta de crédito'),
('Transferencia');
-- Gastos
INSERT INTO gastos (descripcion, monto, fecha_gasto, id_metodo, categoria, id_user) VALUES 
('Compra mensual Coto', 45000.00, '2026-07-10', 2, 2, 1),
('Factura de Edesur', 12500.50, '2026-07-12', 3, 3, 2);

-- Insignias
INSERT INTO insignias (nombre, descripcion, cant_tarea, id_categoria_tarea, icono) VALUES
('Reina de la Limpieza', 'Completá 2 tareas de limpieza', 2, 1, NULL),
('Chef de la Casa', 'Completá 2 tareas de cocina', 2, 2, NULL);

-- Tareas
INSERT INTO tareas (descripcion, fecha_vencimiento, estado, id_categoria) VALUES
('Barrer la cocina', '2026-07-20', 'completada', 1),
('Limpiar el baño', '2026-07-21', 'completada', 1),
('Lavar los platos', '2026-07-22', 'completada', 2),
('Cocinar el almuerzo', '2026-07-23', 'completada', 2),
('Sacar la basura', '2026-07-24', 'pendiente', 1);

-- Asignación de tareas a usuarios (tarea_user)
INSERT INTO tarea_user (id_tarea, id_user) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 2);
