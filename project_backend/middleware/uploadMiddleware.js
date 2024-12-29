//UPLOADMIDDLEWARE
const multer = require('multer');
const path = require('path');

// Extensiones y tipos MIME permitidos
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain',
  'application/zip',
  'application/x-tar',
  'application/x-gzip',
  'text/x-python',
  'text/x-csrc',
  'application/octet-stream',
];

const allowedExtensions = ['.txt', '.zip', '.tar', '.gz', '.py', '.c', '.jpeg', '.jpg', '.png', '.gif', '.webp'];

const fileFilter = (req, file, cb) => {
  const fileExtension = `.${file.originalname.split('.').pop()}`;
  const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);
  const isExtensionAllowed = allowedExtensions.includes(fileExtension);

  if (isMimeTypeAllowed || isExtensionAllowed) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo o extensión no permitido: ${file.mimetype} / ${fileExtension}`), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50 MB
});

module.exports = upload;
