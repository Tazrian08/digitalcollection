const mongoose = require('mongoose');

const ConveyorImageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true }, // public relative URL, e.g. /images/conveyor/abc.jpg
  caption: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ConveyorImage', ConveyorImageSchema);