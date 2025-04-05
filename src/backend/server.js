
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());

// Conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistema_gestion'
});

// Verificar conexión a MySQL
connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL exitosamente');
});

// Endpoints API

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor', error: err });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    
    const user = results[0];
    const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });
    
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  });
});

// ==== CRUD Empleados ====

// Obtener todos los empleados
app.get('/api/empleados', (req, res) => {
  connection.query('SELECT * FROM empleados', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener empleados', error: err });
    }
    res.json(results);
  });
});

// Obtener un empleado por ID
app.get('/api/empleados/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM empleados WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el empleado', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    
    res.json(results[0]);
  });
});

// Crear nuevo empleado
app.post('/api/empleados', (req, res) => {
  const { nombre, apellido, cargo, telefono, email } = req.body;
  
  const query = 'INSERT INTO empleados (nombre, apellido, cargo, telefono, email) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [nombre, apellido, cargo, telefono, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el empleado', error: err });
    }
    
    res.status(201).json({
      message: 'Empleado creado exitosamente',
      id: result.insertId
    });
  });
});

// Actualizar empleado
app.put('/api/empleados/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, cargo, telefono, email } = req.body;
  
  const query = 'UPDATE empleados SET nombre = ?, apellido = ?, cargo = ?, telefono = ?, email = ? WHERE id = ?';
  connection.query(query, [nombre, apellido, cargo, telefono, email, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar el empleado', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    
    res.json({
      message: 'Empleado actualizado exitosamente',
      affected: result.affectedRows
    });
  });
});

// Eliminar empleado
app.delete('/api/empleados/:id', (req, res) => {
  const id = req.params.id;
  
  connection.query('DELETE FROM empleados WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el empleado', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    
    res.json({
      message: 'Empleado eliminado exitosamente',
      affected: result.affectedRows
    });
  });
});

// ==== CRUD Donadores ====

// Obtener todos los donadores
app.get('/api/donadores', (req, res) => {
  connection.query('SELECT * FROM donadores', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener donadores', error: err });
    }
    res.json(results);
  });
});

// Obtener un donador por ID
app.get('/api/donadores/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM donadores WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el donador', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Donador no encontrado' });
    }
    
    res.json(results[0]);
  });
});

// Crear nuevo donador
app.post('/api/donadores', (req, res) => {
  const { nombre, apellido, tipo, telefono, email } = req.body;
  
  const query = 'INSERT INTO donadores (nombre, apellido, tipo, telefono, email) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [nombre, apellido, tipo, telefono, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el donador', error: err });
    }
    
    res.status(201).json({
      message: 'Donador creado exitosamente',
      id: result.insertId
    });
  });
});

// Actualizar donador
app.put('/api/donadores/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, tipo, telefono, email } = req.body;
  
  const query = 'UPDATE donadores SET nombre = ?, apellido = ?, tipo = ?, telefono = ?, email = ? WHERE id = ?';
  connection.query(query, [nombre, apellido, tipo, telefono, email, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar el donador', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Donador no encontrado' });
    }
    
    res.json({
      message: 'Donador actualizado exitosamente',
      affected: result.affectedRows
    });
  });
});

// Eliminar donador
app.delete('/api/donadores/:id', (req, res) => {
  const id = req.params.id;
  
  connection.query('DELETE FROM donadores WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el donador', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Donador no encontrado' });
    }
    
    res.json({
      message: 'Donador eliminado exitosamente',
      affected: result.affectedRows
    });
  });
});

// ==== CRUD Donaciones ====

// Obtener todas las donaciones
app.get('/api/donaciones', (req, res) => {
  connection.query('SELECT * FROM donaciones', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener donaciones', error: err });
    }
    res.json(results);
  });
});

// Obtener una donación por ID
app.get('/api/donaciones/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM donaciones WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener la donación', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Donación no encontrada' });
    }
    
    res.json(results[0]);
  });
});

// Crear nueva donación
app.post('/api/donaciones', (req, res) => {
  const { donador_id, tipo, descripcion, cantidad, fecha } = req.body;
  
  const query = 'INSERT INTO donaciones (donador_id, tipo, descripcion, cantidad, fecha) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [donador_id, tipo, descripcion, cantidad, fecha], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear la donación', error: err });
    }
    
    res.status(201).json({
      message: 'Donación creada exitosamente',
      id: result.insertId
    });
  });
});

// Actualizar donación
app.put('/api/donaciones/:id', (req, res) => {
  const id = req.params.id;
  const { donador_id, tipo, descripcion, cantidad, fecha } = req.body;
  
  const query = 'UPDATE donaciones SET donador_id = ?, tipo = ?, descripcion = ?, cantidad = ?, fecha = ? WHERE id = ?';
  connection.query(query, [donador_id, tipo, descripcion, cantidad, fecha, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar la donación', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Donación no encontrada' });
    }
    
    res.json({
      message: 'Donación actualizada exitosamente',
      affected: result.affectedRows
    });
  });
});

// Eliminar donación
app.delete('/api/donaciones/:id', (req, res) => {
  const id = req.params.id;
  
  connection.query('DELETE FROM donaciones WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar la donación', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Donación no encontrada' });
    }
    
    res.json({
      message: 'Donación eliminada exitosamente',
      affected: result.affectedRows
    });
  });
});

// ==== CRUD Inventario ====

// Obtener todo el inventario
app.get('/api/inventario', (req, res) => {
  connection.query('SELECT * FROM inventario', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el inventario', error: err });
    }
    res.json(results);
  });
});

// Obtener un item del inventario por ID
app.get('/api/inventario/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM inventario WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el item', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    
    res.json(results[0]);
  });
});

// Crear nuevo item en inventario
app.post('/api/inventario', (req, res) => {
  const { nombre, categoria, cantidad, descripcion, ubicacion } = req.body;
  
  const query = 'INSERT INTO inventario (nombre, categoria, cantidad, descripcion, ubicacion) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [nombre, categoria, cantidad, descripcion, ubicacion], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el item', error: err });
    }
    
    res.status(201).json({
      message: 'Item creado exitosamente',
      id: result.insertId
    });
  });
});

// Actualizar item en inventario
app.put('/api/inventario/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, categoria, cantidad, descripcion, ubicacion } = req.body;
  
  const query = 'UPDATE inventario SET nombre = ?, categoria = ?, cantidad = ?, descripcion = ?, ubicacion = ? WHERE id = ?';
  connection.query(query, [nombre, categoria, cantidad, descripcion, ubicacion, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar el item', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    
    res.json({
      message: 'Item actualizado exitosamente',
      affected: result.affectedRows
    });
  });
});

// Eliminar item del inventario
app.delete('/api/inventario/:id', (req, res) => {
  const id = req.params.id;
  
  connection.query('DELETE FROM inventario WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el item', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    
    res.json({
      message: 'Item eliminado exitosamente',
      affected: result.affectedRows
    });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor API funcionando en http://localhost:${PORT}`);
});
