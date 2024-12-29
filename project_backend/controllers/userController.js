//usercontroller
const User = require('../models/User');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Obtener perfil de usuario
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Excluye la contraseña
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar perfil de usuario
exports.updateUserProfile = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, // Usa el ID del usuario extraído del token
      { username, email },
      { new: true, runValidators: true } // Devuelve el nuevo documento y aplica validaciones
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id); // Obtener el usuario actual

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hashear la nueva contraseña
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // No devolver la contraseña
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};


// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );

    await userToDelete.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Subida de imagen de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_images/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.profileImage = `/uploads/profile_images/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Imagen de perfil actualizada.', profileImageUrl: user.profileImage });
  } catch (error) {
    console.error('Error al subir la imagen de perfil:', error.message);
    res.status(500).json({ error: 'Error al subir la imagen de perfil.' });
  }
};

// Buscar usuarios
exports.searchUsers = async (req, res) => {
  const { query } = req.query; // Recibe el término de búsqueda desde el cliente
  if (!query) {
    return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda.' });
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('-password'); // Excluye la contraseña

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.upload = upload.single('profileImage');
