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
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, fecha_completada, notas, id_categoria) VALUES 
('Lavar los platos', '2026-08-05', TRUE, 'hecha', '2026-08-04 20:00:00', 'Después de la cena', 2),
('Sacar la basura', '2026-08-05', TRUE, 'hecha', '2026-08-05 09:00:00', 'Turno de Jesús', 1),
('Comprar papel higiénico', '2026-08-06', FALSE, 'hecha', '2026-08-05 12:00:00', 'Hacer lista de compras', 6),
('Revisar la lámpara del living', '2026-07-27', FALSE, 'pendiente', NULL, 'Posible cambio de foco', 3),
('Limpiar el baño', '2026-08-10', FALSE, 'hecha', '2026-08-09 18:00:00', 'Limpiar pisa y bacha', 1),
('Comprar flores para el living', '2026-08-20', FALSE, 'pendiente', NULL, NULL, 6),
('Barrer el living', '2026-08-10', TRUE, 'hecha', '2026-08-10 08:00:00', 'Turno de María', 1),
('Limpiar los vidrios', '2026-08-11', FALSE, 'hecha', '2026-08-10 17:00:00', 'Turno de María', 1),
('Cocinar el asado', '2026-08-11', FALSE, 'hecha', '2026-08-11 20:00:00', 'Turno de María', 2),
('Preparar la cena', '2026-08-12', TRUE, 'hecha', '2026-08-12 19:00:00', 'Turno de María', 2),
('Arreglar el enchufe', '2026-08-01', FALSE, 'hecha', '2026-08-05 10:00:00', 'Turno de Pedro', 3),
('Pintar la pared', '2026-08-02', FALSE, 'hecha', '2026-08-01 15:00:00', 'Turno de Pedro', 3),
('Reparar la puerta', '2026-08-03', FALSE, 'hecha', '2026-08-02 11:00:00', 'Turno de Pedro', 3),
('Regar las plantas', '2026-08-01', TRUE, 'hecha', '2026-08-01 08:00:00', 'Turno de Pedro', 4),
('Cortar el pasto', '2026-08-02', FALSE, 'hecha', '2026-08-01 16:00:00', 'Turno de Pedro', 4),
('Podar el arbolito', '2026-08-03', FALSE, 'hecha', '2026-08-02 14:00:00', 'Turno de Pedro', 4),
('Pasear al perro', '2026-08-01', TRUE, 'hecha', '2026-08-01 07:00:00', 'Turno de Pedro', 5),
('Alimentar al gato', '2026-08-02', TRUE, 'hecha', '2026-08-01 07:30:00', 'Turno de Pedro', 5),
('Limpiar la pecera', '2026-08-03', FALSE, 'hecha', '2026-08-02 13:00:00', 'Turno de Pedro', 5);
-- Iconos
INSERT INTO iconos (nombre, clase, color) VALUES
('Trofeo', 'fa-trophy', '#FFD700'),
('Estrella', 'fa-star', '#FFD700'),
('Medalla', 'fa-medal', '#FFD700'),
('Corona', 'fa-crown', '#FFD700'),
('Fuego', 'fa-fire', '#FF4500'),
('Corazón', 'fa-heart', '#FF0000'),
('Gema', 'fa-gem', '#00BFFF'),
('Escudo', 'fa-shield', '#4169E1'),
('Rayo', 'fa-bolt', '#FFD700'),
('Escoba', 'fa-broom', '#00BFA5'),
('Cubiertos', 'fa-utensils', '#F5A623'),
('Llave inglesa', 'fa-wrench', '#7C4DFF'),
('Hoja', 'fa-leaf', '#00BFA5'),
('Pata', 'fa-paw', '#FF6B35');
-- Insignias
INSERT INTO insignias (nombre, descripcion, cant_tarea, id_categoria_tarea, id_icono) VALUES 
('Chef del mes', 'Completa 3 tareas de cocina', 3, 2, 11),
('Eco-friendly', 'Saca la basura 3 veces', 3, 1, 10),
('Comprador estrella', 'Realiza 3 compras', 3, 6, 2),
('Manitas de oro', 'Completa 3 tareas de mantenimiento', 3, 3, 12),
('Pulgar verde', 'Completa 3 tareas de jardinería', 3, 4, 13),
('Amigo de los animales', 'Completa 3 tareas de mascotas', 3, 5, 14);
-- Relación tarea-usuario
INSERT INTO tarea_user (id_tarea, id_user) VALUES 
(1, 4),
(2, 3),
(3, 5),
(4, 3),
(5, 4),
(7, 4),
(8, 4),
(9, 4),
(10, 4),
(11, 5),
(12, 5),
(13, 5),
(14, 5),
(15, 5),
(16, 5),
(17, 5),
(18, 5),
(19, 5);
