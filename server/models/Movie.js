const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  genre: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  cast: { 
    type: [String], 
    required: true,
    validate: {
      validator: function(v) { return v && v.length > 0; },
      message: 'Cast must have at least one item.'
    }
  },
  language: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
