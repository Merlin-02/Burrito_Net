
//server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const usersRouter = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const projectRoutes = require('./routes/projects');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Cambia al dominio del frontend en producción
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRoutes);
app.use('/projects', projectRoutes);

// Ruta para obtener contenido de archivos
app.get('/projects/file-content', (req, res) => {
  const { filePath } = req.query;
  if (!filePath) {
    return res.status(400).json({ error: 'Ruta del archivo no proporcionada.' });
  }

  const absolutePath = path.join(__dirname, filePath);

  fs.readFile(absolutePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo:', err.message);
      return res.status(500).json({ error: 'Error al leer el archivo.' });
    }
    res.json({ content: data });
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Puerto y servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
