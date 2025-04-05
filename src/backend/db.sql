
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_gestion;
USE sistema_gestion;

-- Tabla de usuarios (para login)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'usuario') DEFAULT 'usuario',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  fecha_contratacion DATE DEFAULT CURRENT_DATE,
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de donadores
CREATE TABLE IF NOT EXISTS donadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  tipo ENUM('individual', 'empresarial', 'fundacion') NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de donaciones
CREATE TABLE IF NOT EXISTS donaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donador_id INT,
  tipo ENUM('monetaria', 'especie') NOT NULL,
  descripcion TEXT,
  cantidad DECIMAL(10, 2),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donador_id) REFERENCES donadores(id)
);

-- Tabla de inventario
CREATE TABLE IF NOT EXISTS inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  cantidad INT NOT NULL,
  descripcion TEXT,
  ubicacion VARCHAR(100),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador predeterminado
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@example.com', 'admin123', 'admin');

-- Insertar algunos empleados de ejemplo
INSERT INTO empleados (nombre, apellido, cargo, telefono, email) VALUES 
('Juan', 'Pérez', 'Coordinador', '555-1234', 'juan@example.com'),
('María', 'López', 'Asistente', '555-5678', 'maria@example.com'),
('Carlos', 'Gómez', 'Voluntario', '555-9012', 'carlos@example.com');

-- Insertar algunos donadores de ejemplo
INSERT INTO donadores (nombre, apellido, tipo, telefono, email) VALUES 
('Roberto', 'Martínez', 'individual', '555-3456', 'roberto@example.com'),
('Empresa ABC', NULL, 'empresarial', '555-7890', 'contacto@abc.com'),
('Fundación XYZ', NULL, 'fundacion', '555-1122', 'fundacion@xyz.org');

-- Insertar algunas donaciones de ejemplo
INSERT INTO donaciones (donador_id, tipo, descripcion, cantidad) VALUES 
(1, 'monetaria', 'Donación mensual', 1000.00),
(2, 'especie', 'Equipo de cómputo', NULL),
(3, 'monetaria', 'Donación para proyecto escolar', 5000.00);

-- Insertar algunos items de inventario de ejemplo
INSERT INTO inventario (nombre, categoria, cantidad, descripcion, ubicacion) VALUES 
('Computadoras', 'Electrónica', 10, 'Computadoras de escritorio', 'Almacén A'),
('Cuadernos', 'Material escolar', 100, 'Cuadernos de 100 hojas', 'Almacén B'),
('Sillas', 'Mobiliario', 20, 'Sillas plegables', 'Almacén C');
