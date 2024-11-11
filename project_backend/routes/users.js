<<<<<<< HEAD
// routes/users.js
=======
//users.js
>>>>>>> 640cf8a7ee3b9cefe6c3d7b3efff33157a5b7038
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
