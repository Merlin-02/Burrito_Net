//projects.js
const express = require('express');
const {
  createProject,
  getProjects,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { createCommit, getCommits } = require('../controllers/commitController');
const { getFileContent } = require('../controllers/fileController'); // Importación de la función
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Importar Multer

const router = express.Router();

// Rutas para proyectos


router.post('/', authenticateToken, upload.single('file'), createProject);

router.get('/', authenticateToken, getProjects);
router.get('/:id/project', authenticateToken, getProjectById);

router.put('/:id', authenticateToken, updateProject);

router.delete('/:id', authenticateToken, deleteProject);
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
