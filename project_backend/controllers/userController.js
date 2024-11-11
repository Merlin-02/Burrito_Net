// controllers/userControllers.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

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

// Seguir a un usuario
exports.followUser = async (req, res) => {
  // Extraemos los ids desde el body de la solicitud
  const { currentUserId, userIdToFollow } = req.body;

  try {
    // Buscar los usuarios en la base de datos
    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verificar si el usuario ya sigue al usuario objetivo
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Agregar el usuario a la lista de seguidores y seguidos
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    // Guardar los cambios en la base de datos
    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error following user' });
  }
};

// Dejar de seguir a un usuario
exports.unfollowUser = async (req, res) => {
  // Extraemos los ids desde el body de la solicitud
  const { currentUserId, userIdToUnfollow } = req.body;

  try {
    // Buscar los usuarios en la base de datos
    const userToUnfollow = await User.findById(userIdToUnfollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verificar si el usuario ya sigue al usuario objetivo
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // Eliminar al usuario de la lista de seguidores y seguidos
    currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());

    // Guardar los cambios en la base de datos
    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error unfollowing user' });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Buscar al usuario a eliminar
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Eliminar el usuario de las listas de seguidores y seguidos de otros usuarios
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } } // Eliminar el usuario de las listas de seguidos
    );

    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } } // Eliminar el usuario de las listas de seguidores
    );

    // Eliminar el usuario de la base de datos
    await userToDelete.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
