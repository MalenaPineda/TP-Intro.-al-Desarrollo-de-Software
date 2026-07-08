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
('Servicios (Luz/Gas/Internet)'),
('Delivery y Salidas'),
('Artículos de Limpieza');

-- Gastos (Relaciona usuario y categoria_gastos)
INSERT INTO gastos (descripcion, monto, fecha_gasto, metodo_pago, categoria, id_user) VALUES 
('Compra mensual Coto', 45000.00, '2026-06-10', 'Tarjeta de débito', 2, 1),
('Factura de Edesur', 12500.50, '2026-06-12', 'Transferencia', 3, 2);

-- Tareas
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria) VALUES 
('Lavar los platos de la cena', '2026-06-20', TRUE, 'pendiente', 'Incluye ollas y sartenes', 2),
('Cortar el pasto del patio', '2026-06-25', FALSE, 'pendiente', 'Usar la cortadora del garage', 4);

-- Insignias
INSERT INTO insignias (descripcion, cant_tarea, icono, nivel, id_categoria) VALUES 
('As de la Escoba (Completar 10 limpiezas)', 10, 'broom_icon.png', 'plata', 1),
('Cheff de la Casa (Completar 5 tareas de cocina)', 5, 'chef_hat.png', 'bronce', 2);

-- Usuario - Insignia
INSERT INTO user_Insignia (id_user, id_insignia, disponible, fecha_obtenida) VALUES 
(1, 1, TRUE, CURRENT_TIMESTAMP),
(2, 2, TRUE, CURRENT_TIMESTAMP);

-- Tarea asignada a un usuario
INSERT INTO tarea_user (id_tarea, id_user) VALUES 
(1, 1, TRUE, CURRENT_TIMESTAMP),
(2, 2);