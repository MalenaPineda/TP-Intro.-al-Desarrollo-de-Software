/*INSERT INTO usuarios VALUES('Jesus', 'jesus@gmail.com', '12345');
*/

-- Usuarios (roomies)
INSERT INTO usuarios (nombre, email, contrasenia, fecha_nacimiento)
VALUES 
('Jesús', 'jesus@hogar.com', 'hashjesus', '2002-05-06'),
('María', 'maria@hogar.com', 'hashmaria', '1998-09-14'),
('Pedro', 'pedro@hogar.com', 'hashpedro', '1995-12-01');

-- Categorías de tareas (quehaceres del hogar)
INSERT INTO categoria_tareas (nombre)
VALUES 
('Limpieza'),
('Cocina'),
('Compras'),
('Mantenimiento');

-- Categorías de gastos (hogar)
INSERT INTO categoria_gastos (nombre)
VALUES 
('Supermercado'),
('Servicios'),
('Transporte'),
('Ocio');

-- Gastos compartidos
INSERT INTO gastos (descripcion, monto, metodo_pago, categoria, id_user)
VALUES 
('Compra semanal en supermercado', 15000.00, 'Tarjeta débito', 1, 1),
('Factura de electricidad', 8000.00, 'Transferencia bancaria', 2, 2),
('Taxi al centro', 2500.00, 'Efectivo', 3, 3),
('Pizza del viernes', 6000.00, 'Tarjeta crédito', 1, 2);

-- Tareas del hogar
INSERT INTO tareas (descripcion, fecha_vencimiento, diaria, estado, notas, id_categoria)
VALUES 
('Lavar los platos', '2026-06-24', TRUE, 'pendiente', 'Después de la cena', 2),
('Sacar la basura', '2026-06-24', TRUE, 'pendiente', 'Turno de Jesús', 1),
('Comprar papel higiénico', '2026-06-25', FALSE, 'pendiente', 'Hacer lista de compras', 3),
('Revisar la lámpara del living', '2026-06-27', FALSE, 'pendiente', 'Posible cambio de foco', 4);

-- Insignias (gamificación de convivencia)
INSERT INTO insignias (nombre, descripcion, cant_tarea, id_categoria_tarea, icono)
VALUES 
('Chef del mes', 'Completa 20 tareas de cocina', 20, 2, 'chef.png'),
('Eco-friendly', 'Saca la basura 15 veces', 15, 1, 'eco.png'),
('Comprador estrella', 'Realiza 10 compras', 10, 3, 'shopping.png');

-- Relación usuario-insignia
INSERT INTO user_insignia (id_user, id_insignia, disponible)
VALUES 
(1, 2, TRUE),   -- Jesús ya ganó "Eco-friendly"
(2, 1, FALSE),  -- María aún no tiene "Chef del mes"
(3, 3, TRUE);   -- Pedro ya tiene "Comprador estrella"

-- Relación tarea-usuario (quién hace qué)
INSERT INTO tarea_user (id_tarea, id_user)
VALUES 
(1, 2),  -- María lava los platos
(2, 1),  -- Jesús saca la basura
(3, 3),  -- Pedro compra papel higiénico
(4, 1);  -- Jesús revisa la lámpara
