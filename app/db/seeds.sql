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
