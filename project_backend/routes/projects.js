const express = require('express');
const {
  createProject,
  getProjects,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getAllProjects,  // Asegúrate de importar la nueva función
} = require('../controllers/projectController');
const { createCommit, getCommits } = require('../controllers/commitController');
const { getFileContent } = require('../controllers/fileController'); // Importación de la función
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Importar Multer

const router = express.Router();

// Rutas para proyectos

// Crear un proyecto
router.post('/', authenticateToken, upload.single('file'), createProject);

// Obtener los proyectos del usuario autenticado
router.get('/', authenticateToken, getProjects);

// Obtener todos los proyectos de todos los usuarios (nueva ruta)
router.get('/all', getAllProjects); // Ruta añadida

// Obtener un proyecto por su ID
router.get('/:id/project', authenticateToken, getProjectById);

// Actualizar un proyecto por su ID
router.put('/:id', authenticateToken, updateProject);

// Eliminar un proyecto por su ID
router.delete('/:id', authenticateToken, deleteProject);

// Obtener los proyectos del usuario autenticado (propietario)
router.get('/own', authenticateToken, getUserProjects);

// Subir archivos a un proyecto
router.post('/:id/files', authenticateToken, upload.single('file'), (req, res) => {
  try {
    res.json({ message: 'File uploaded', file: req.file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas para commits
router.post('/:id/commits', authenticateToken, createCommit);
router.get('/:id/commits', authenticateToken, getCommits);

// Obtener contenido del archivo
router.get('/file-content', authenticateToken, getFileContent);

module.exports = router;
