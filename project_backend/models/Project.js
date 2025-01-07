const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String },
  fileType: { type: String },
  fileName: { type: String },
});

module.exports = mongoose.model('Project', projectSchema);
