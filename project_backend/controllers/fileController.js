const fs = require('fs');
const path = require('path');

// Controlador para obtener el contenido de un archivo
exports.getFileContent = async (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ error: 'Ruta del archivo no proporcionada.' });
  }

  const absolutePath = path.resolve(filePath);

  try {
    const content = fs.readFileSync(absolutePath, 'utf8'); // Leer el contenido del archivo
    res.status(200).json({ content });
  } catch (error) {
    console.error('Error al leer el archivo:', error.message);
    res.status(500).json({ error: 'No se pudo leer el archivo.' });
  }
};
