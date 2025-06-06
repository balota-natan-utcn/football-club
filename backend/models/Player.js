const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
  },
  jerseyNumber: {
    type: Number,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    required: true
  },
  height: {
    type: String,
    default: ''
  },
  weight: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);