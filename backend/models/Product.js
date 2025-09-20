const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim:true },
  description: { type: String, required: true },
  long_desc: { type: String }, // <-- Add this line
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Camera, Lens, Accessory
  compatibility: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Products this is compatible with
  images: [{ type: String }], // URLs for product images
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);