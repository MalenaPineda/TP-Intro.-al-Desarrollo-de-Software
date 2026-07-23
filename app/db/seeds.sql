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
('Compra mensual Coto', 45000.00, '2026-06-10', 2, 2, 1),
('Factura de Edesur', 12500.50, '2026-06-12', 3, 3, 2);