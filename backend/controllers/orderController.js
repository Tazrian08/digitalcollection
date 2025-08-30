const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create a new order from cart
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, phone } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (let item of cart.items) {
      totalAmount += item.product.price * item.quantity;
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      phone,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'Processing'
    });

    await order.save();

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ orderId: order.orderId, order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// Get user's orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user') // <-- Add this
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// Get order details
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

exports.getOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('user').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If not admin, only allow if user owns the order
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findOne({ orderId }).populate('user').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order' });
  }
};