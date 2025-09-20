const mongoose = require('mongoose');

const quadAdSchema = new mongoose.Schema({
  position: { type: String, enum: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'], required: true },
  image: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuadAd', quadAdSchema);