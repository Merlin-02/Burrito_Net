// models/Commit.js
const mongoose = require('mongoose');

const commitSchema = new mongoose.Schema({
  message: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Commit', commitSchema);
