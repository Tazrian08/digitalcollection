const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: { type: String, required: true }, // path to image file
  link: String, // optional: where ad should redirect
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ad', adSchema);