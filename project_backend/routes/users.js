const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  getAllUsers,   // Nueva función para obtener todos los usuarios
  followUser     // Nueva función para seguir a un usuario
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Rutas para el perfil del usuario
router.get('/:id/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.post('/change-password', authenticateToken, changePassword);

// Nueva ruta para obtener todos los usuarios
router.get('/', authenticateToken, getAllUsers);

// Nueva ruta para seguir a un usuario
router.post('/:id/follow', authenticateToken, followUser);

module.exports = router;
