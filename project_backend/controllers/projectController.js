// controllers/projectController.js
const Project = require('../models/Project');

// Crear un proyecto
// Crear un proyecto
exports.createProject = async (req, res) => {
  console.log("Datos recibidos en el backend (req.body):", req.body);
  console.log("Archivo recibido (req.file):", req.file);

  try {
    const { name, description, tags } = req.body;

    // Validar campos obligatorios
    if (!name || !description) {
      return res.status(400).json({ error: "El nombre y la descripción son obligatorios." });
    }

    // Asegúrate de que req.file esté definido y genera el fileUrl
    const fileName = req.file?.filename;
    const fileUrl = fileName ? `/uploads/${fileName}` : null;

    // Crear el proyecto
    const project = new Project({
      name,
      description,
      tags: tags ? JSON.parse(tags) : [], // Asegurar que los tags sean un array
      createdBy: req.user.id, // ID del usuario autenticado
      fileUrl, // URL del archivo (si existe)
      fileType: req.file?.mimetype || null, // Tipo de archivo (opcional)
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Error en el backend:", error.message);
    res.status(400).json({ error: error.message });
  }
};



// Obtener todos los proyectos del usuario
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'username email'); // Popular datos del creador
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Obtener todos los proyectos de todos los usuarios
exports.getAllProjects = async (req, res) => {
  try {
    // Buscamos todos los proyectos sin ningún filtro en particular.
    const projects = await Project.find().populate('createdBy', 'username email'); // Popular datos del creador
    res.json(projects); // Devolvemos todos los proyectos encontrados
  } catch (error) {
    res.status(500).json({ error: error.message }); // Manejo de errores en caso de falla
  }
};


exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un proyecto por ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un proyecto
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un proyecto
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
