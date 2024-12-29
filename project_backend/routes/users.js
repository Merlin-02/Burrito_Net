// routes/users.js
//users.js
const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  getAllUsers,   // Nueva función para obtener todos los usuarios
  followUser,     // Nueva función para seguir a un usuario
  unfollowUser,
  deleteUser,
  uploadProfileImage 
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

// Rutas para el perfil del usuario
router.get('/:id/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.post('/change-password', authenticateToken, changePassword);


// Nueva ruta para obtener todos los usuarios
router.get('/', authenticateToken, getAllUsers);

// Nueva ruta para seguir a un usuario
router.post('/follow', authenticateToken, followUser);

// Modificamos para eliminar un seguidor
router.post('/unfollow', authenticateToken, unfollowUser); // RUTA PARA DEJAR DE SEGUIR A UN USUARIO
router.delete('/:id', authenticateToken, deleteUser); // Ruta para eliminar un usuario

// Ruta para subir la imagen de perfil
router.post('/upload-profile-image', authenticateToken, upload.single('profileImage'), uploadProfileImage);

// Ruta para obtener el perfil del usuario
router.get('/:id/profile', authenticateToken, getUserProfile);


// Subir archivos a un proyecto pensaba algo similar pero para imagens del usuario 
router.post('/:id/files', authenticateToken, upload.single('file'), (req, res) => {
  try {
    res.json({ message: 'File uploaded', file: req.file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;