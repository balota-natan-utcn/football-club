const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  website: {
    type: String,
    default: ''
  },
  tier: {
    type: String,
    enum: ['main', 'secondary', 'partner'],
    default: 'partner'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sponsor', sponsorSchema);