const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  deleteUser,
  uploadProfileImage,
  searchUsers,
} = require('../controllers/userController');
const { followUser, unfollowUser } = require('../controllers/followController'); // Importa las funciones del controlador correcto
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rutas para el perfil del usuario
router.get('/:id/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.post('/change-password', authenticateToken, changePassword);

// Rutas para la gestión de usuarios
router.get('/', authenticateToken, getAllUsers);
router.delete('/:id', authenticateToken, deleteUser); // Eliminar usuario

// Rutas para seguir/dejar de seguir usuarios
router.post('/:id/follow', authenticateToken, followUser);
router.post('/:id/unfollow', authenticateToken, unfollowUser);

// Ruta para subir imagen de perfil
router.post(
  '/upload-profile-image',
  authenticateToken,
  upload.single('profileImage'),
  uploadProfileImage
);

// Ruta para buscar usuarios
router.get('/search', authenticateToken, searchUsers);

// Ruta para subir archivos (opcional)
router.post('/:id/files', authenticateToken, upload.single('file'), (req, res) => {
  try {
    res.json({ message: 'File uploaded', file: req.file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
