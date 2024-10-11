const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const router = express.Router();

// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'El usuario ya existe' });

        const salt = await bcrypt.genSalt(10); // Generar sal
        const hashedPassword = await bcrypt.hash(password, salt); // Hash de la contraseña

        user = new User({ username, email, password: hashedPassword });
        
        await user.save();
        res.json({ msg: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'El usuario no existe' });

        // Usa el método comparePassword para verificar la contraseña
        const isPasswordVerified = user.comparePassword(password);
        if (!isPasswordVerified) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id }, 'jwtSecret', { expiresIn: 3600 });
        res.json({ token, userId: user.id }); // Incluir userId en la respuesta
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json({ msg: 'Usuario eliminado' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Subir archivo
router.post('/:id/upload', upload.single('file'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const file = {
            filename: req.file.filename,
            description: req.body.description
        };

        user.files.push(file); // Asegúrate de que tu esquema de User tenga un campo 'files' que sea un arreglo
        await user.save();

        res.json({ msg: 'Archivo subido exitosamente', file });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});


// Obtener archivos subidos por el usuario
router.get('/:id/files', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json(user.files); // Enviar la lista de archivos subidos
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Logout (no es necesario realizar acciones en el servidor)
router.post('/logout', (req, res) => {
    res.json({ msg: 'Logout exitoso, elimina el token del lado del cliente' });
});


module.exports = router;
