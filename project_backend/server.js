// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload'); // Importar las rutas de subida

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api', uploadRoutes); // Usar las rutas para subir
//Revisar posibles errores posteriores
app.use(express.urlencoded({ extended: true }));//para aceptar datos en el formato URL codificado apenas agregue

// Puerto y servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
