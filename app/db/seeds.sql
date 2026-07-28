-- Usuarios
INSERT INTO usuarios (nombre, email, contrasenia, fecha_nacimiento, activo) VALUES 
('Juan Pérez', 'juan.perez@gmail.com', 'password', '1998-03-14', TRUE),
('Ana Gómez', 'ana.gomez@gmail.com', 'password', '2000-07-22', TRUE),
('Jesús', 'jesus@hogar.com', 'hashjesus', '2002-05-06', TRUE),
('María', 'maria@hogar.com', 'hashmaria', '1998-09-14', TRUE),
('Pedro', 'pedro@hogar.com', 'hashpedro', '1995-12-01', TRUE);

-- Categorías de Tareas
INSERT INTO categoria_tareas (nombre) VALUES 
('Limpieza'),
('Cocina'),
('Mantenimiento'),
('Jardinería'),
('Mascotas'),
('Compras');

-- Categorías de Gastos
INSERT INTO categoria_gastos (nombre) VALUES 
('Alquiler y Expensas'),
('Supermercado'),
('Servicios'),
('Delivery y Salidas'),
('Artículos de Limpieza'),
('Transporte'),
('Ocio');

-- Métodos de pago
INSERT INTO metodo_pago (nombre) VALUES 
('Efectivo'),
('Tarjeta de crédito'),
('Transferencia'),
('Tarjeta débito'),
('Transferencia bancaria');

-- Gastos
INSERT INTO gastos (descripcion, monto, fecha_gasto, id_metodo, categoria, id_user) VALUES 
('Compra mensual Coto', 45000.00, '2026-07-10', 2, 2, 1),
('Factura de Edesur', 12500.50, '2026-07-12', 3, 3, 2),
('Compra semanal en supermercado', 15000.00, '2026-07-20', 4, 2, 3),
('Factura de electricidad', 8000.00, '2026-07-21', 5, 3, 4),
('Taxi al centro', 2500.00, '2026-07-22', 4, 6, 5),
('Pizza del viernes', 6000.00, '2026-07-23', 1, 4, 4);

-- Tareas del hogar
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria) VALUES 
('Lavar los platos', '2026-06-24', TRUE, 'pendiente', 'Después de la cena', 2),
('Sacar la basura', '2026-06-24', TRUE, 'pendiente', 'Turno de Jesús', 1),
('Comprar papel higiénico', '2026-06-25', FALSE, 'pendiente', 'Hacer lista de compras', 6),
('Revisar la lámpara del living', '2026-06-27', FALSE, 'pendiente', 'Posible cambio de foco', 3),
('Limpiar el baño', '2026-07-28', FALSE, 'pendiente', 'Limpiar pisa y bacha', 1),
('Comprar flores para el living', '2026-08-01', FALSE, 'pendiente', NULL, 6);

-- Insignias
INSERT INTO insignias (nombre, descripcion, cant_tarea, id_categoria_tarea, icono) VALUES 
('Chef del mes', 'Completa 20 tareas de cocina', 20, 2, 'chef.png'),
('Eco-friendly', 'Saca la basura 15 veces', 15, 1, 'eco.png'),
('Comprador estrella', 'Realiza 10 compras', 10, 6, 'shopping.png');

-- Relación usuario-insignia
INSERT INTO user_insignia (id_user, id_insignia, disponible) VALUES 
(3, 2, TRUE),
(4, 1, FALSE),
(5, 3, TRUE);

-- Relación tarea-usuario
INSERT INTO tarea_user (id_tarea, id_user) VALUES 
(1, 4),
(2, 3),
(3, 5),
(4, 3);
