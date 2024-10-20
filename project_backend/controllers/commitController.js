// controllers/commitController.js
const Commit = require('../models/Commit');

// Crear un commit
exports.createCommit = async (req, res) => {
  try {
    const commit = new Commit({ ...req.body, projectId: req.params.id });
    await commit.save();
    res.status(201).json(commit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los commits de un proyecto
exports.getCommits = async (req, res) => {
  try {
    const commits = await Commit.find({ projectId: req.params.id });
    res.json(commits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
