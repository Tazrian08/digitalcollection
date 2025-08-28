const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // Unique order ID
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate unique orderId
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const lastOrder = await mongoose.model('Order').findOne().sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastOrder && lastOrder.orderId) {
      const num = parseInt(lastOrder.orderId.slice(2), 10);
      nextNum = num + 1;
    }
    this.orderId = 'OR' + String(nextNum).padStart(5, '0');
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);