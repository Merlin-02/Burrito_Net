// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  }
});

const upload = multer({ storage });

// Ruta para subir proyectos
router.post('/upload', upload.single('projectFile'), (req, res) => {
  const projectFile = req.file;
  if (!projectFile) {
    return res.status(400).send('No se ha subido ningún archivo.');
  }
  res.send(`Archivo ${projectFile.filename} subido con éxito.`);
});

module.exports = router;
