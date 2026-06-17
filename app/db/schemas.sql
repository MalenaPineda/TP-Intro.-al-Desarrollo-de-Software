CREATE TABLE casa (
    id_casa SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE categoria_tareas (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios (
    id_user SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL
);

CREATE TABLE casa_user (
    id_casa_user SERIAL PRIMARY KEY, /*Agrego campo faltante Att: Jesús David*/
    id_casa INT REFERENCES Casa(id_casa) ON DELETE CASCADE,
    id_user INT REFERENCES Usuarios(id_user) ON DELETE CASCADE,
    PRIMARY KEY (id_casa, id_user)
);

CREATE TABLE gastos (
    id_gasto SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    categoria INT REFERENCES Categoria_gastos(id_categoria_gasto),
    id_user INT REFERENCES Usuarios(id_user) ON DELETE SET NULL,
    id_casa INT REFERENCES Casa(id_casa) ON DELETE CASCADE
);

CREATE TABLE categoria_gastos (
    id_categoria_gasto SERIAL PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE tareas (
    id_tarea SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    fecha_vencimiento DATE,
    id_categoria INT REFERENCES Categoria_tareas(id_categoria),
    diaria BOOLEAN DEFAULT FALSE
);


CREATE TABLE insignias (
    id_insignia SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    cant_tarea INT NOT NULL,
    id_categoria INT REFERENCES Categoria_tareas(id_categoria),
    icono VARCHAR(255)
);

CREATE TABLE user_Insignia (
    id_user INT REFERENCES Usuarios(id_user) ON DELETE CASCADE,
    id_insignia INT REFERENCES Insignias(id_insignia) ON DELETE CASCADE,
    fecha_ganada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disponible BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_user, id_insignia)
);

CREATE TABLE tarea_user (
    id_tarea INT REFERENCES Tareas(id_tarea) ON DELETE CASCADE,
    id_casa_user INT REFERENCES Casa_user(id_casa_user) ON DELETE CASCADE,
    aprobada BOOLEAN DEFAULT FALSE,
    fecha_aprobacion TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (id_tarea, id_casa_user)
);