-- Usuarios
INSERT INTO usuarios (id_user, nombre, email, contrasenia, fecha_nacimiento, activo) VALUES 
(1, 'Juan Pérez', 'juan.perez@gmail.com', 'password', '1998-03-14', TRUE),
(2, 'Ana Gómez', 'ana.gomez@gmail.com', 'password', '2000-07-22', TRUE),
(3, 'Jesús', 'jesus@hogar.com', 'hashjesus', '2002-05-06', TRUE),
(4, 'María', 'maria@hogar.com', 'hashmaria', '1998-09-14', TRUE),
(5, 'Pedro', 'pedro@hogar.com', 'hashpedro', '1995-12-01', TRUE);

-- Categorías de Tareas
INSERT INTO categoria_tareas (id_categoria, nombre) VALUES 
(1, 'Limpieza'),
(2, 'Cocina'),
(3, 'Mantenimiento'),
(4, 'Jardinería'),
(5, 'Mascotas'),
(6, 'Compras');

-- Categorías de Gastos
INSERT INTO categoria_gastos (id_categoria, nombre) VALUES 
(1, 'Alquiler y Expensas'),
(2, 'Supermercado'),
(3, 'Servicios'),
(4, 'Delivery y Salidas'),
(5, 'Artículos de Limpieza'),
(6, 'Transporte'),
(7, 'Ocio');

-- Métodos de pago
INSERT INTO metodo_pago (id, nombre) VALUES 
(1, 'Efectivo'),
(2, 'Tarjeta de crédito'),
(3, 'Transferencia'),
(4, 'Tarjeta débito'),
(5, 'Transferencia bancaria');

-- Gastos
INSERT INTO gastos (descripcion, monto, fecha_gasto, id_metodo, categoria, id_user) VALUES 
('Compra mensual Coto', 45000.00, '2026-07-10', 2, 2, 1),
('Factura de Edesur', 12500.50, '2026-07-12', 3, 3, 2),
('Compra semanal en supermercado', 15000.00, '2026-07-20', 4, 2, 3),
('Factura de electricidad', 8000.00, '2026-07-21', 5, 3, 4),
('Taxi al centro', 2500.00, '2026-07-22', 4, 6, 5),
('Pizza del viernes', 6000.00, '2026-07-23', 1, 4, 4);

-- Tareas del hogar
INSERT INTO tareas (id_tarea, descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria) VALUES 
(1, 'Lavar los platos', '2026-06-24', TRUE, 'en progreso', 'Después de la cena', 2),
(2, 'Sacar la basura', '2026-06-24', TRUE, 'en progreso', 'Turno de Jesús', 1),
(3, 'Comprar papel higiénico', '2026-06-25', FALSE, 'en progreso', 'Hacer lista de compras', 6),
(4, 'Revisar la lámpara del living', '2026-06-27', FALSE, 'en progreso', 'Posible cambio de foco', 3),
(5, 'Limpiar el baño', '2026-07-28', FALSE, 'pendiente', 'Limpiar pisa y bacha', 1),
(6, 'Comprar flores para el living', '2026-08-01', FALSE, 'pendiente', NULL, 6);

-- Insignias
INSERT INTO insignias (id_insignia, nombre, descripcion, cant_tarea, id_categoria_tarea, icono) VALUES 
(1, 'Chef del mes', 'Completa 20 tareas de cocina', 20, 2, 'chef.png'),
(2, 'Eco-friendly', 'Saca la basura 15 veces', 15, 1, 'eco.png'),
(3, 'Comprador estrella', 'Realiza 10 compras', 10, 6, 'shopping.png');

-- Relación tarea-usuario
INSERT INTO tarea_user (id_tarea, id_user) VALUES 
(1, 4),
(2, 3),
(3, 5),
(4, 3),
(5, 4),
(6, 2);