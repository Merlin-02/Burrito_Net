// Importar librerías
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://Merlin:f5CKlqqtjUmqeZs8@cluster0.pt6cb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB', err));

// Importar rutas
const userRoutes = require('./routes/userRoutes');

// Usar las rutas bajo el prefijo /api/users
app.use('/api/users', userRoutes);

// Iniciar el servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
