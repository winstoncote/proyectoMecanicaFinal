const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin'] }
});

module.exports = mongoose.model('Usuario', usuarioSchema);