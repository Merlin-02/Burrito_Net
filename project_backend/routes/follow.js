const express = require('express');
const { followUser, unfollowUser } = require('../controllers/followController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para seguir a un usuario
router.post('/:id/follow', authenticateToken, followUser);

// Ruta para dejar de seguir a un usuario
router.post('/:id/unfollow', authenticateToken, unfollowUser);

module.exports = router;
