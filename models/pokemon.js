const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^(https?:\/\/).+/.test(v),
      message: 'La URL de la imagen no es válida',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false, // No devolver este campo por defecto
  },
});

module.exports = mongoose.model('Pokemon', pokemonSchema);
