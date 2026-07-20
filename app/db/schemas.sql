CREATE TABLE usuarios (
    id_user SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE categoria_tareas (
    id_categoria SERIAL PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE categoria_gastos (
    id_categoria SERIAL PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE metodo_pago (
    id SERIAL PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE gastos (
    id_gasto SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_gasto DATE DEFAULT CURRENT_DATE,
    id_metodo INT NOT NULL,
    categoria INT NOT NULL,
    id_user INT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categoria_gastos(id_categoria),
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user),
    FOREIGN KEY (id_metodo) REFERENCES metodo_pago(id)
);

CREATE TABLE tareas (
    id_tarea SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    fecha_vencimiento DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diaria BOOLEAN DEFAULT FALSE,
    estado VARCHAR(30) DEFAULT 'pendiente',
    notas VARCHAR(255),
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria_tareas(id_categoria)
);

CREATE TABLE insignias (
    id_insignia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    cant_tarea INT NOT NULL,
    id_categoria_tarea INT,
    icono VARCHAR(255),
    FOREIGN KEY (id_categoria_tarea) REFERENCES categoria_tareas(id_categoria)
);

CREATE TABLE user_insignia (
    id_user INT NOT NULL,
    id_insignia INT NOT NULL,
    disponible BOOLEAN DEFAULT FALSE,
    fecha_obtenida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_insignia),
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user),
    FOREIGN KEY (id_insignia) REFERENCES insignias(id_insignia)
);

CREATE TABLE tarea_user (
    id_tarea INT NOT NULL,
    id_user INT NOT NULL,
    PRIMARY KEY (id_tarea, id_user),
    FOREIGN KEY (id_tarea) REFERENCES tareas(id_tarea),
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user)
);